"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";

export const LLM_SUMMARY = `# Image optimization for web apps (summary for LLMs)
Lifecycle: upload -> storage -> processing -> delivery -> browser loading -> rendering -> caching.
1. Upload: direct-to-object-storage (S3/R2) via presigned URL; validate MIME + file signature + size + dimensions; optional client-side resize.
2. Storage: keep originals private; store generated variants separately (originals/, optimized/, thumbnails/); keep dimensions + mime in DB.
3. Formats: AVIF (photos) > WebP (general) > JPEG (fallback); PNG for transparency; SVG for icons. Strip EXIF (privacy). Tools: sharp, libvips, squoosh.
4. Responsive: srcset + sizes + <picture>; always set width/height or aspect-ratio. Never ship 2000px to a 350px slot.
5. CDN/cache: Cache-Control: public, max-age=31536000, immutable on versioned URLs. Browser cache and CDN cache are separate.
6. Loading: loading="lazy" + decoding="async" below the fold; hero/LCP image eager + fetchpriority="high" (never lazy-load LCP, never mark everything high).
7. UX: LQIP/BlurHash placeholder, aspect-ratio box, fade-in, error fallback, virtualize big grids.
8. Pipeline: upload -> validate -> store original -> worker (sharp) -> AVIF/WebP variants -> CDN.
9. Measure: Lighthouse, LCP, CLS, CDN hit ratio, transfer size.
Start with: direct upload, resizing, AVIF/WebP, CDN caching, srcset, lazy loading, correct dimensions. Add the rest when needed.`;

/** One button. It does not show the summary, it only copies it. On click it turns green and draws a tick. */
export function SummaryButton() {
  const [ok, setOk] = useState(false);
  const copy = async () => {
    await navigator.clipboard.writeText(LLM_SUMMARY);
    setOk(true);
    setTimeout(() => setOk(false), 1800);
  };
  return (
    <>
      <style>{`
        .sb-tick{stroke-dasharray:18;stroke-dashoffset:18;animation:sbDraw .35s .1s ease-out forwards}
        @keyframes sbDraw{to{stroke-dashoffset:0}}
        .sb-ring{position:absolute;inset:-4px;border-radius:inherit;border:2.5px solid #34C759;pointer-events:none;animation:sbPulse .9s ease-out forwards}
        .dark .sb-ring{border-color:#30D158}
        @keyframes sbPulse{0%{opacity:.8;transform:scale(.96)}100%{opacity:0;transform:scale(1.12)}}
      `}</style>
      <Button
        size="sm"
        onClick={copy}
        className={`relative min-w-[96px] gap-1.5 text-white transition-colors duration-300 ${
          ok
            ? "bg-[#34C759] hover:bg-[#34C759] dark:bg-[#30D158] dark:hover:bg-[#30D158]"
            : "bg-[#0066CC] hover:bg-[#0058B0] dark:bg-[#0A84FF] dark:hover:bg-[#2997FF]"
        }`}
      >
        {ok && <span key="ring" className="sb-ring" />}
        {ok && (
          <svg viewBox="0 0 16 16" className="size-4" aria-hidden>
            <circle cx="8" cy="8" r="7.5" fill="white" />
            <path className="sb-tick" d="M4.6 8.3 7 10.7l4.4-4.9" fill="none" stroke="#34C759" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}
        {ok ? "Copied" : "Summary"}
      </Button>
    </>
  );
}
