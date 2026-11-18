"use client";
import { useState } from "react";
import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
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

export function Summary() {
  const [ok, setOk] = useState(false);
  return (
    <Card>
      <CardHeader>
        <CardTitle>TL;DR for humans and LLMs</CardTitle>
        <CardDescription>Copy and paste into any LLM to give it this doc as context.</CardDescription>
        <CardAction>
          <Button size="sm" onClick={async () => {
            await navigator.clipboard.writeText(LLM_SUMMARY);
            setOk(true); setTimeout(() => setOk(false), 1500);
          }}>{ok ? "Copied ✓" : "Copy summary"}</Button>
        </CardAction>
      </CardHeader>
      <CardContent>
        <pre className="max-h-56 overflow-auto whitespace-pre-wrap rounded-md bg-muted p-3 text-xs leading-relaxed">{LLM_SUMMARY}</pre>
      </CardContent>
    </Card>
  );
}
