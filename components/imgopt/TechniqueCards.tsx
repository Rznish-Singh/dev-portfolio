"use client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { IoTheme } from "@/components/imgopt/theme";

// No code here on purpose: each card is a plain explanation.
export type T = { title: string; tag: string; desc: string; why: string };

const TONES = ["var(--io-blue)", "var(--io-purple)", "var(--io-teal)", "var(--io-amber)", "var(--io-green)", "var(--io-pink)"];
const tint = (c: string, pct: number) => `color-mix(in oklab, ${c} ${pct}%, transparent)`;

export function TechniqueGroup({ items }: { items: T[] }) {
  return (
    <div className="io not-prose grid gap-3 md:grid-cols-2">
      <IoTheme />
      {items.map((t, i) => {
        const c = TONES[i % TONES.length];
        return (
          <Card key={t.title} size="sm" className="bg-[var(--io-card)] text-[var(--io-ink)] ring-[var(--io-line)]">
            <CardHeader>
              <CardTitle>{t.title}</CardTitle>
              <CardDescription className="text-[var(--io-sub)]">{t.desc}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <span className="inline-block rounded-full px-2 py-0.5 text-[10px] font-semibold" style={{ background: tint(c, 14), color: c }}>{t.tag}</span>
              <p className="rounded-lg px-2.5 py-1.5 text-xs" style={{ background: tint("var(--io-blue)", 10), border: `1px solid ${tint("var(--io-blue)", 28)}` }}>
                <b style={{ color: "var(--io-blue)" }}>In short:</b> {t.why}
              </p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}

export const FORMAT_TECH: T[] = [
  { title: "Format plan", tag: "format", desc: "Use AVIF for photos, WebP as the fallback, JPEG or PNG when needed, and SVG for logos and icons.", why: "The browser picks the best format it supports." },
  { title: "Sharp", tag: "tool", desc: "A tool that resizes photos, makes AVIF and WebP copies, and removes private data like location from EXIF.", why: "Run it once and every size is made for you." },
  { title: "Image CDN", tag: "service", desc: "A service that resizes and converts images on the fly, based on the URL and the browser.", why: "No need to make every version by hand." },
];
export const LOAD_TECH: T[] = [
  { title: "Preload the hero", tag: "preload", desc: "Tell the browser early about the main image, especially when CSS or JavaScript hides it from the HTML.", why: "Preload only the main image, not all of them." },
  { title: "Priority hints", tag: "fetch priority", desc: "Mark the main image high. Mark small secondary images low. Never mark everything high.", why: "If everything is important, nothing is." },
  { title: "Lazy loading", tag: "below the fold", desc: "Images below the screen wait until the user scrolls near them. Never lazy-load the main image.", why: "The first screen loads faster." },
  { title: "Async decoding", tag: "decoding", desc: "Downloading and decoding are two steps. Async decoding stops decoding from blocking other work on the page.", why: "It helps smoothness, not network speed." },
];
export const INFRA_TECH: T[] = [
  { title: "Long cache time", tag: "http header", desc: "Tell browsers and CDNs to keep an image for a year when the URL never changes.", why: "Repeat visits need no network at all." },
  { title: "Versioned URLs", tag: "cache", desc: "Change the file name when the image changes, like product-v2. The old cache is then never wrong.", why: "Long caching without stale images." },
  { title: "Preconnect", tag: "network", desc: "Open the connection to your image CDN early if it is on another domain and needed right away.", why: "Do not preconnect to every domain." },
  { title: "Presigned upload", tag: "upload", desc: "Your backend gives a temporary link and the user's image goes straight to S3/R2.", why: "Your server skips the heavy work." },
  { title: "Upload validation", tag: "security", desc: "Check the real file type, not just the name. Also limit the file size and dimensions.", why: "Protects you from fake or huge files." },
];
