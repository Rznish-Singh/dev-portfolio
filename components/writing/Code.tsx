"use client";

import { useState } from "react";
import { Highlight, type PrismTheme } from "prism-react-renderer";

const theme: PrismTheme = {
  plain: { color: "#343740", backgroundColor: "transparent" },
  styles: [
    { types: ["comment", "prolog"], style: { color: "#828790" } },
    { types: ["punctuation", "operator"], style: { color: "#717784" } },
    { types: ["keyword", "atrule"], style: { color: "#d1242f" } },
    { types: ["string", "attr-value", "template-string"], style: { color: "#0a3069" } },
    { types: ["function", "property", "attr-name"], style: { color: "#1f58b0" } },
    { types: ["number", "boolean", "constant"], style: { color: "#c46524" } },
    { types: ["tag", "class-name", "builtin"], style: { color: "#1a7f37" } },
  ],
};

export function Code({ children, lang = "tsx" }: { children: string; lang?: string }) {
  const code = children.trim();
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {}
  }

  return (
    <div className="relative rounded-xl bg-black/[0.03] dark:bg-white/[0.05]">
      <Highlight theme={theme} code={code} language={lang}>
        {({ tokens, getLineProps, getTokenProps }) => (
          <pre className="overflow-x-auto p-3 pr-12 font-mono text-[0.7rem] leading-6 sm:p-4 sm:pr-14 sm:text-xs">
            {tokens.map((line, i) => (
              <div key={i} {...getLineProps({ line, className: "table-row" })}>
                <span className="table-cell select-none pr-4 text-right text-muted/70 sm:pr-5">
                  {i + 1}
                </span>
                <span className="table-cell whitespace-pre">
                  {line.map((token, k) => (
                    <span key={k} {...getTokenProps({ token })} />
                  ))}
                  {"\u200b"}
                </span>
              </div>
            ))}
          </pre>
        )}
      </Highlight>

      <button
        onClick={copy}
        aria-label={copied ? "Copied" : "Copy code"}
        className="absolute right-2 top-2 rounded-md p-1.5 text-muted transition-colors hover:bg-black/[0.05] hover:text-ink sm:right-3 sm:top-3"
      >
        {copied ? (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 12.5 10 17.5 19 7" />
          </svg>
        ) : (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <rect x="8.75" y="8.75" width="10.5" height="10.5" rx="2" />
            <path d="M15.25 8.75V6.25a1.5 1.5 0 0 0-1.5-1.5h-7.5a1.5 1.5 0 0 0-1.5 1.5v7.5a1.5 1.5 0 0 0 1.5 1.5h2.5" />
          </svg>
        )}
      </button>
    </div>
  );
}