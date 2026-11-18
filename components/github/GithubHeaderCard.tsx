'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'motion/react';

import { cn } from '@/lib/utils';

export interface GithubHeaderCardProps {
  username: string;
  className?: string;
}

// Five-step indigo scale (lightest = no activity) matching the app's accent.
const TEAL_SCALE = ['#f0efee', '#d4d3ff', '#a9a7ff', '#817fff', '#615fff'];

const generateEmptyContributions = () => {
  const data = [];
  const today = new Date();
  for (let i = 118; i >= 0; i--) {
    const date = new Date(today.getTime() - i * 24 * 60 * 60 * 1000);
    data.push({ date: date.toISOString().split('T')[0], count: 0, level: 0 });
  }
  return data;
};

export function GithubHeaderCard({ username, className }: GithubHeaderCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [profile, setProfile] = useState({ name: username, avatarUrl: `https://github.com/${username}.png` });
  const [contributions, setContributions] = useState(() => generateEmptyContributions());

  useEffect(() => {
    setMounted(true);

    fetch(`https://api.github.com/users/${username}`)
      .then((res) => (res.ok ? res.json() : Promise.reject()))
      .then((data) => setProfile({ name: data.name || data.login || username, avatarUrl: data.avatar_url }))
      .catch(() => {});

    fetch(`https://github-contributions-api.jogruber.de/v4/${username}`)
      .then((res) => (res.ok ? res.json() : Promise.reject()))
      .then((data: { contributions?: { date: string; count: number; level: number }[] }) => {
        if (!data.contributions?.length) return;
        const today = new Date();
        const sorted = data.contributions
          .filter((d) => new Date(d.date) <= today)
          .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
        setContributions(sorted.slice(-119));
      })
      .catch(() => {});
  }, [username]);

  const totalContributions = useMemo(() => contributions.reduce((acc, c) => acc + c.count, 0), [contributions]);

  const cardRef = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 300, damping: 20 });
  const springY = useSpring(y, { stiffness: 300, damping: 20 });
  const rotateX = useTransform(springY, (val) => 4 - ((val + 20) / 40) * 8);
  const rotateY = useTransform(springX, (val) => -4 + ((val + 20) / 40) * 8);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    x.set(((e.clientX - rect.left - rect.width / 2) / (rect.width / 2)) * 20);
    y.set(((e.clientY - rect.top - rect.height / 2) / (rect.height / 2)) * 20);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    x.set(0);
    y.set(0);
  };

  return (
    <div
      className={cn('relative z-50 flex w-max flex-col items-end [perspective:1000px]', className)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
    >
      <a
        href={`https://github.com/${username}`}
        target="_blank"
        rel="noopener noreferrer"
        className="text-xs font-medium text-muted-foreground underline-offset-4 transition-colors hover:text-foreground hover:underline"
      >
        GitHub
      </a>

      <motion.div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        initial="hidden"
        animate={isHovered ? 'visible' : 'hidden'}
        style={{ x: springX, rotateX, rotateY, transformStyle: 'preserve-3d' }}
        variants={{
          hidden: { opacity: 0, y: 6, scale: 0.98, pointerEvents: 'none', transition: { duration: 0.15 } },
          visible: { opacity: 1, y: 0, scale: 1, pointerEvents: 'auto', transition: { duration: 0.22, ease: [0.16, 1, 0.3, 1] } },
        }}
        className="absolute top-full right-0 z-50 mt-3 w-[min(18rem,calc(100vw-2rem))] rounded-2xl border border-border bg-card p-5 shadow-xl"
      >
        <div className="mb-4 flex items-center gap-3">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={profile.avatarUrl}
            alt={`${profile.name}'s avatar`}
            className="h-10 w-10 rounded-full border border-border object-cover"
          />
          <div className="flex flex-col text-left">
            <span className="text-sm font-semibold text-foreground">{profile.name}</span>
            <span className="text-xs text-muted-foreground">@{username}</span>
          </div>
        </div>

        <div className="mx-auto grid w-max grid-flow-col grid-rows-7 gap-1">
          {contributions.map((day, i) => (
            <div
              key={day.date || i}
              title={mounted && day.date ? `${day.count} contributions on ${day.date}` : undefined}
              style={{ backgroundColor: TEAL_SCALE[day.level] }}
              className="h-2.5 w-2.5 rounded-[2px]"
            />
          ))}
        </div>

        <span className="mt-3 block text-left font-mono text-xs text-muted-foreground">
          {mounted ? `${totalContributions.toLocaleString()} contributions this year` : '… contributions'}
        </span>
      </motion.div>
    </div>
  );
}