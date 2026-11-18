import type { ReactNode } from "react";

export { Code } from "./Code";

export const P = ({ children }: { children: ReactNode }) => (
  <p className="leading-7 text-ink/85">{children}</p>
);

// Yellow marker highlight
export const Mark = ({ children }: { children: ReactNode }) => (
  <mark className="rounded-sm bg-yellow-300/80 px-0.5 text-ink dark:bg-yellow-400/70 dark:text-black">
    {children}
  </mark>
);

// Wrapper for live components. On sm+ you can widen it: <Demo wide>
export const Demo = ({
  children,
  caption,
  wide = false,
}: {
  children: ReactNode;
  caption?: string;
  wide?: boolean;
}) => (
  <figure className={wide ? "sm:-mx-10 lg:-mx-16" : undefined}>
    <div className="overflow-x-auto rounded-2xl border border-line bg-black/[0.02] p-4 dark:bg-white/[0.03]">
      {children}
    </div>
    {caption && (
      <figcaption className="mt-2 text-center text-xs text-muted">{caption}</figcaption>
    )}
  </figure>
);