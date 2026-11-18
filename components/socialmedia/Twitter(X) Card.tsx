"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "motion/react";
import { cn } from "@/lib/utils";

export interface TwitterCardProps {
  username: string;
  name?: string;
  avatarUrl?: string;
  bannerUrl?: string;
  staticCard?: boolean;
  joinedDate?: string;
  year?: number | string;
  text?: string;
  linkText?: string;
  href?: string;
  enableLinkTilt?: boolean;
  linkTiltMaxRotate?: number;
  enableCardTilt?: boolean;
  cardTiltMaxRotate?: number;
  className?: string;
  popoverClassName?: string;
  linkClassName?: string;
  labelClassName?: string;
}

interface Profile {
  name: string;
  avatarUrl: string;
  bannerUrl: string;
  bio: string;
  following: number | string;
  followers: number | string;
  joinedDate: string;
  location: string;
  website: { url: string; display_url: string } | null;
}

const XIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={cn("fill-current", className)}>
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

const formatCount = (count: number | string) => {
  if (typeof count === "string") return count;
  if (count >= 1000000) {
    return (count / 1000000).toFixed(1).replace(/\.0$/, "") + "M";
  }
  if (count >= 1000) {
    return (count / 1000).toFixed(1).replace(/\.0$/, "") + "K";
  }
  return count.toString();
};

const iconProps = {
  width: 14,
  height: 14,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

/* Shared card content (used by both static and popover versions) */
const CardBody = ({
  profile,
  username,
  profileUrl,
}: {
  profile: Profile;
  username: string;
  profileUrl: string;
}) => (
  <>
    <div className="relative -mx-4 -mt-4 h-24 overflow-hidden rounded-t-2xl bg-neutral-100 dark:bg-neutral-900">
      {profile.bannerUrl ? (
        <img
          src={profile.bannerUrl}
          alt="Profile Banner"
          className="h-full w-full object-cover"
        />
      ) : (
        <div className="h-full w-full bg-gradient-to-r from-neutral-200 to-neutral-300 dark:from-neutral-800 dark:to-neutral-900" />
      )}
    </div>

    <div className="relative mb-2 flex items-start justify-between">
      {profile.avatarUrl ? (
        <img
          src={profile.avatarUrl}
          alt={`${profile.name}'s Avatar`}
          className="relative z-10 -mt-8 h-16 w-16 rounded-full border-4 border-white bg-neutral-100 object-cover shadow-md dark:border-neutral-950 dark:bg-neutral-900"
        />
      ) : (
        <div className="relative z-10 -mt-8 h-16 w-16 rounded-full border-4 border-white bg-neutral-200 shadow-md dark:border-neutral-950 dark:bg-neutral-800" />
      )}
      <div className="mt-2 text-neutral-400 transition-colors hover:text-neutral-900 dark:text-neutral-500 dark:hover:text-neutral-200">
        <XIcon className="h-5 w-5" />
      </div>
    </div>

    <div className="flex flex-col text-left">
      <span className="text-base leading-snug font-semibold text-neutral-900 transition-colors dark:text-white">
        {profile.name}
      </span>
      <a
        href={profileUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="text-sm text-neutral-500 transition-colors hover:text-neutral-800 dark:text-neutral-400 dark:hover:text-neutral-200"
      >
        @{username}
      </a>
    </div>

    <p className="mt-2 text-left text-sm leading-relaxed text-neutral-900 dark:text-neutral-100">
      {profile.bio}
    </p>

    <div className="mt-2 flex flex-wrap gap-x-4 gap-y-2 text-xs text-neutral-500 dark:text-neutral-400">
      {profile.location && (
        <div className="flex items-center gap-1.5">
          <svg {...iconProps}>
            <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
            <circle cx="12" cy="10" r="3" />
          </svg>
          <span>{profile.location}</span>
        </div>
      )}
      {profile.website && (
        <div className="flex items-center gap-1.5">
          <svg {...iconProps}>
            <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
            <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
          </svg>
          <a
            href={profile.website.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 hover:text-blue-600 hover:underline dark:text-sky-500 dark:hover:text-sky-400"
          >
            {profile.website.display_url}
          </a>
        </div>
      )}
      {profile.joinedDate && (
        <div className="flex items-center gap-1.5">
          <svg {...iconProps}>
            <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
            <line x1="16" x2="16" y1="2" y2="6" />
            <line x1="8" x2="8" y1="2" y2="6" />
            <line x1="3" x2="21" y1="10" y2="10" />
          </svg>
          <span>{profile.joinedDate}</span>
        </div>
      )}
    </div>

    <div className="mt-2 flex flex-col gap-2 text-left text-sm text-neutral-500 dark:text-neutral-400">
      <div className="flex gap-4">
        <div className="flex gap-1">
          <span className="font-bold text-neutral-900 dark:text-white">
            {formatCount(profile.following)}
          </span>
          <span>Following</span>
        </div>
        <div className="flex gap-1">
          <span className="font-bold text-neutral-900 dark:text-white">
            {formatCount(profile.followers)}
          </span>
          <span>Followers</span>
        </div>
      </div>
    </div>
  </>
);

export const TwitterCard = ({
  username,
  name = "Twitter User",
  avatarUrl,
  bannerUrl,
  staticCard = false,
  joinedDate,
  year = 2026,
  text = "Follow me on",
  linkText = "X",
  href,
  enableLinkTilt = true,
  linkTiltMaxRotate = 5,
  enableCardTilt = true,
  cardTiltMaxRotate = 5,
  className,
  popoverClassName,
  linkClassName,
  labelClassName,
}: TwitterCardProps) => {
  const [isHovered, setIsHovered] = useState(false);

  const profileUrl = href || `https://x.com/${username}`;
  // Never an empty string, so <img src> is always valid
  const fallbackAvatar = avatarUrl || `https://unavatar.io/x/${username}`;

  const linkRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const [hoverType, setHoverType] = useState<"none" | "link" | "card">("none");

  const [profile, setProfile] = useState<Profile>({
    name: name || "Twitter User",
    avatarUrl: fallbackAvatar,
    bannerUrl: bannerUrl || "",
    bio: "This user hasn't added a bio yet.",
    following: 0,
    followers: 0,
    joinedDate: joinedDate || `Joined ${year}`,
    location: "",
    website: null,
  });

  useEffect(() => {
    fetch(`https://api.fxtwitter.com/${username}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.code === 200 && data.user) {
          const user = data.user;
          setProfile({
            name: user.name || name,
            avatarUrl:
              user.avatar_url?.replace("_normal", "_400x400") ||
              fallbackAvatar,
            bannerUrl: user.banner_url || bannerUrl || "",
            bio: user.description || "This user hasn't added a bio yet.",
            following: user.following ?? 0,
            followers: user.followers ?? 0,
            joinedDate: user.joined
              ? `Joined ${new Date(user.joined).toLocaleDateString("en-US", {
                  month: "long",
                  year: "numeric",
                })}`
              : joinedDate || `Joined ${year}`,
            location: user.location || "",
            website: user.website || null,
          });
        }
      })
      .catch(() => {});
  }, [username, name, fallbackAvatar, bannerUrl, joinedDate, year]);

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x, { stiffness: 300, damping: 20 });
  const mouseYSpring = useSpring(y, { stiffness: 300, damping: 20 });

  const rotateX = useTransform(mouseYSpring, (val) => {
    const maxRotate =
      hoverType === "link" ? linkTiltMaxRotate : cardTiltMaxRotate;
    const pct = (val + 20) / 40;
    return maxRotate - pct * (2 * maxRotate);
  });
  const rotateY = useTransform(mouseXSpring, (val) => {
    const maxRotate =
      hoverType === "link" ? linkTiltMaxRotate : cardTiltMaxRotate;
    const pct = (val + 20) / 40;
    return -maxRotate + pct * (2 * maxRotate);
  });

  const handleMove =
    (ref: React.RefObject<HTMLDivElement | null>, enabled: boolean) =>
    (e: React.MouseEvent) => {
      if (!enabled || !ref.current) {
        x.set(0);
        y.set(0);
        return;
      }
      const rect = ref.current.getBoundingClientRect();
      x.set(((e.clientX - rect.left - rect.width / 2) / (rect.width / 2)) * 20);
      y.set(
        ((e.clientY - rect.top - rect.height / 2) / (rect.height / 2)) * 20,
      );
    };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setHoverType("none");
    x.set(0);
    y.set(0);
  };

  const popoverStyle = {
    x: mouseXSpring,
    rotateX,
    rotateY,
    transformStyle: "preserve-3d" as const,
  };

  if (staticCard) {
    return (
      <div
        className={cn(
          "w-80 rounded-2xl border border-dashed border-neutral-300 bg-white/95 p-4 shadow-xl backdrop-blur-md transition-colors dark:border-neutral-800 dark:bg-neutral-950/80",
          className,
        )}
      >
        <CardBody
          profile={profile}
          username={username}
          profileUrl={profileUrl}
        />
      </div>
    );
  }

  return (
    <div className={cn("flex items-center gap-1.5", className)}>
      <span
        className={cn(
          "text-lg font-medium text-neutral-900/60 transition-colors dark:text-neutral-100/60",
          labelClassName,
        )}
      >
        {text}
      </span>
      <div
        className="sm:relative flex w-max flex-col items-center [perspective:1000px]"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={handleMouseLeave}
      >
        <div
          ref={linkRef}
          onMouseEnter={() => {
            setHoverType("link");
            if (!enableLinkTilt) {
              x.set(0);
              y.set(0);
            }
          }}
          onMouseMove={handleMove(linkRef, enableLinkTilt)}
          className="cursor-pointer"
        >
          <a href={profileUrl} target="_blank" rel="noopener noreferrer">
            <span
              className={cn(
                "text-lg font-medium text-neutral-900/60 underline underline-offset-4 transition-all duration-300 hover:text-neutral-900 dark:text-neutral-100/60 dark:hover:text-neutral-100",
                linkClassName,
              )}
            >
              {linkText}
            </span>
          </a>
        </div>

        <motion.div
          ref={cardRef}
          onMouseEnter={() => {
            setHoverType("card");
            if (!enableCardTilt) {
              x.set(0);
              y.set(0);
            }
          }}
          onMouseMove={handleMove(cardRef, enableCardTilt)}
          initial="hidden"
          style={popoverStyle}
          animate={isHovered ? "visible" : "hidden"}
        variants={{
  hidden: {
    opacity: 0,
    y: -8,
    scale: 0.96,
    filter: "blur(4px)",
    pointerEvents: "none",
    transformOrigin: "top center",
    transition: { duration: 0.15, ease: "easeIn" },
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    filter: "blur(0px)",
    pointerEvents: "auto",
    transformOrigin: "top center",
    transition: { duration: 0.28, ease: [0.16, 1, 0.3, 1] },
  },
}}
className={cn(
  "absolute top-full z-50 mt-3 w-80 rounded-2xl bg-white p-4 shadow-[0_12px_40px_-12px_rgba(0,0,0,0.3)] before:absolute before:bottom-full before:left-0 before:h-3 before:w-full dark:bg-neutral-950",
  popoverClassName,
)}
        >
          <CardBody
            profile={profile}
            username={username}
            profileUrl={profileUrl}
          />
        </motion.div>
      </div>
    </div>
  );
};

export default TwitterCard;

/**
 * Great UI Component
 * Website: https://great-ui.com
 * GitHub: https://github.com/Saurabh-2607/GreatUI
 * Author: Saurabh Sharma
 * Released under the Great UI Custom License Agreement.
 */