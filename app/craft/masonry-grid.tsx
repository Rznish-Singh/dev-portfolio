import React from 'react';

export type BreakpointName = 'sm' | 'md' | 'lg' | 'xl' | '2xl';

export type BreakpointConfig = {
  [key in BreakpointName]?: number;
};

export interface MasonryGridProps {
  gap?: number;
  breakpoints: BreakpointConfig;
  className?: string;
  children?: React.ReactNode;
}

// Tailwind's default breakpoint widths
const BREAKPOINT_WIDTHS: { [key in BreakpointName]: number } = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536,
};

export const MasonryGrid: React.FC<MasonryGridProps> = ({
  gap = 16,
  breakpoints,
  className = '',
  children,
}) => {
  // Deterministic class name for this breakpoint configuration, so multiple
  // grids on the same page don't clash.
  const createHashFromInput = (input: string): string => {
    let hashAccumulator = 0;
    for (let i = 0; i < input.length; i++) {
      hashAccumulator = (hashAccumulator * 31 + input.charCodeAt(i)) | 0;
    }
    return Math.abs(hashAccumulator).toString(36);
  };

  const configKey = JSON.stringify({ breakpoints, gap });
  const masonryClassId = `masonry-${createHashFromInput(configKey)}`;

  const responsiveCssRules: string[] = [];
  responsiveCssRules.push(`.${masonryClassId} { column-gap: ${gap}px; }`);
  responsiveCssRules.push(`.${masonryClassId} { column-count: 1; }`);

  (Object.keys(BREAKPOINT_WIDTHS) as BreakpointName[]).forEach((name) => {
    const minWidth = BREAKPOINT_WIDTHS[name];
    const cols = breakpoints[name];
    if (typeof cols === 'number' && cols > 0) {
      responsiveCssRules.push(
        `@media (min-width: ${minWidth}px) { .${masonryClassId} { column-count: ${cols}; } }`
      );
    }
  });

  const styleContent = `
.${masonryClassId} > * { break-inside: avoid; margin-bottom: ${gap}px; }
${responsiveCssRules.join('\n')}
`.trim();

  const wrappedChildren = React.Children.toArray(children).map(
    (child, index) => <div key={index}>{child}</div>
  );

  return (
    <div className={`relative mx-0 my-auto mb-20 flex flex-col ${className}`}>
      <style
        dangerouslySetInnerHTML={{ __html: styleContent }}
        suppressHydrationWarning
      />
      <div className={`${masonryClassId} w-auto`}>{wrappedChildren}</div>
    </div>
  );
};
