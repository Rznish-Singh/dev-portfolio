'use client';

import { ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { cn } from './utils';
import type { CraftType } from './data';

export interface CraftCardProps {
  src: string;
  title: string;
  date: string;
  href: string;
  craftType: CraftType;
  theme?: 'light' | 'dark';
  position?: 'top' | 'bottom';
  className?: string;
  blurImage?: string;
  type?: 'image' | 'video';
  aspectRatio?: number;
}

export const CraftCard = ({
  title,
  date,
  src,
  href,
  craftType,
  theme = 'light',
  aspectRatio = 4 / 3,
  position = 'bottom',
  className = '',
  blurImage,
  type = 'image',
}: CraftCardProps) => {
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const isVideo = type === 'video';
  const showContent = isVideo ? isVideoLoaded : isImageLoaded;

  useEffect(() => {
    if (!isVideo) return;

    const videoElement = videoRef.current;
    if (!videoElement) return;

    const handleLoaded = () => {
      if (videoElement.readyState >= 3) setIsVideoLoaded(true);
    };

    videoElement.addEventListener('loadeddata', handleLoaded);
    videoElement.addEventListener('canplay', handleLoaded);
    videoElement.addEventListener('playing', handleLoaded);

    if (videoElement.readyState >= 3) handleLoaded();

    return () => {
      videoElement.removeEventListener('loadeddata', handleLoaded);
      videoElement.removeEventListener('canplay', handleLoaded);
      videoElement.removeEventListener('playing', handleLoaded);
    };
  }, [isVideo]);

  const isExternal = href?.startsWith('http');

  return (
    <div
      className={cn(
        'block w-full overflow-hidden rounded-xl border border-neutral-200 bg-white transition-all duration-200 dark:border-neutral-800 dark:bg-neutral-900',
        className,
        { 'p-1': craftType !== 'none' }
      )}
    >
      <div
        className={cn('relative overflow-hidden', {
          'rounded-lg': craftType !== 'none',
        })}
      >
        <div className="relative w-full" style={{ aspectRatio }}>
          {isVideo && blurImage && (
            <img
              aria-hidden="true"
              className={cn(
                'absolute inset-0 h-full w-full transition-opacity duration-300',
                { 'opacity-0': showContent, 'opacity-100': !showContent }
              )}
              src={blurImage}
              style={{ filter: 'blur(32px)', transform: 'scale(1) translateZ(0px)' }}
              alt=""
            />
          )}

          {isVideo ? (
            <video
              ref={videoRef}
              src={src}
              autoPlay
              loop
              muted
              playsInline
              className={cn(
                'absolute inset-0 h-full w-full object-cover transition-opacity duration-300',
                { 'opacity-0': !isVideoLoaded, 'opacity-100': isVideoLoaded }
              )}
            />
          ) : (
            <img
              src={src}
              onLoad={() => setIsImageLoaded(true)}
              className="absolute inset-0 h-full w-full object-cover"
              alt={title}
            />
          )}

          <div
            className={cn(
              'pointer-events-none absolute bottom-0 left-0 z-10 h-24 w-full bg-linear-to-t from-black/70 via-transparent to-transparent'
            )}
          />

          <div
            className={cn(
              'absolute left-0 z-20 flex h-8 w-full flex-row flex-nowrap items-center justify-between gap-3 whitespace-nowrap p-4',
              { 'top-2': position === 'top', 'bottom-2': position === 'bottom' }
            )}
          >
            <div
              className={cn('overflow-hidden text-ellipsis whitespace-nowrap text-sm', {
                'text-neutral-100': theme === 'light',
                'text-neutral-900': theme === 'dark',
              })}
            >
              {title}
            </div>
            <div
              className={cn('overflow-hidden text-ellipsis whitespace-nowrap text-sm', {
                'text-neutral-300': theme === 'light',
                'text-neutral-700': theme === 'dark',
              })}
            >
              {date}
            </div>
          </div>
        </div>
      </div>

      {craftType !== 'none' && (
        <Link
          href={href}
          target={isExternal ? '_blank' : undefined}
          className="mt-1 flex h-10 items-center justify-center gap-1.5 rounded-lg bg-neutral-100 font-medium text-neutral-900 text-sm transition-colors duration-150 hover:bg-neutral-200 dark:bg-neutral-800 dark:text-neutral-100 dark:hover:bg-neutral-700"
        >
          {craftType === 'project'
            ? 'View Live'
            : craftType === 'component'
              ? 'View Prototype'
              : 'Read Article'}
          <ArrowRight size={16} className={isExternal ? '-rotate-45' : ''} />
        </Link>
      )}
    </div>
  );
};
