import type { MDXComponents } from "mdx/types";

// This file allows you to provide custom React components to be used in MDX
// files. They can be used anywhere in your app, including pages.
export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    h1: (props) => (
      <h1 className="mb-4 mt-10 font-display text-2xl font-semibold tracking-tight text-ink" {...props} />
    ),
    h2: (props) => (
      <h2
        className="mb-3 mt-8 font-display text-lg font-semibold tracking-tight text-ink"
        {...props}
      />
    ),
    h3: (props) => (
      <h3 className="mb-2 mt-6 text-base font-semibold text-ink" {...props} />
    ),
    p: (props) => (
      <p className="mb-4 leading-7 text-ink/80" {...props} />
    ),
    a: (props) => (
      <a
        className="underline decoration-line underline-offset-2 hover:decoration-signal hover:text-signal"
        {...props}
      />
    ),
    ul: (props) => (
      <ul className="mb-4 list-disc space-y-1 pl-5 text-ink/80" {...props} />
    ),
    ol: (props) => (
      <ol className="mb-4 list-decimal space-y-1 pl-5 text-ink/80" {...props} />
    ),
    blockquote: (props) => (
      <blockquote
        className="mb-4 border-l-2 border-signal/40 pl-4 text-ink/70 italic"
        {...props}
      />
    ),
    code: (props) => (
      <code
        className="rounded bg-ink/[0.06] px-1.5 py-0.5 font-mono text-[0.85em]"
        {...props}
      />
    ),
    pre: (props) => (
      <pre
        className="mb-4 overflow-x-auto rounded-lg border border-line bg-ink text-paper p-4 text-sm font-mono"
        {...props}
      />
    ),
    hr: (props) => <hr className="my-8 border-line" {...props} />,
    ...components,
  };
}
