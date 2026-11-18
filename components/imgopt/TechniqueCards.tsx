"use client";
import { useState } from "react";
import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export type T = { title: string; tag: string; desc: string; code: string };

function TechniqueCard({ t }: { t: T }) {
  const [ok, setOk] = useState(false);
  return (
    <Card size="sm" className="not-prose">
      <CardHeader>
        <CardTitle>{t.title}</CardTitle>
        <CardDescription>{t.desc}</CardDescription>
        <CardAction>
          <Button size="sm" variant="ghost" onClick={async () => { await navigator.clipboard.writeText(t.code); setOk(true); setTimeout(() => setOk(false), 1200); }}>
            {ok ? "✓" : "Copy"}
          </Button>
        </CardAction>
      </CardHeader>
      <CardContent>
        <span className="mb-1 inline-block rounded bg-muted px-1.5 py-0.5 text-[10px]">{t.tag}</span>
        <pre className="overflow-x-auto rounded-md bg-muted p-2 text-[11px] leading-relaxed">{t.code}</pre>
      </CardContent>
    </Card>
  );
}

export function TechniqueGroup({ items }: { items: T[] }) {
  return <div className="grid gap-3 md:grid-cols-2">{items.map((t) => <TechniqueCard key={t.title} t={t} />)}</div>;
}

export const FORMAT_TECH: T[] = [
  { title: "AVIF / WebP / JPEG fallback", tag: "html", desc: "Browser takes the first format it supports.",
    code: `<picture>\n  <source type="image/avif" srcset="a.avif">\n  <source type="image/webp" srcset="a.webp">\n  <img src="a.jpg" alt="" width="800" height="600">\n</picture>` },
  { title: "Convert with sharp", tag: "node", desc: "Resize + encode + strip EXIF in one pipeline.",
    code: `await sharp(input)\n  .rotate()            // fix EXIF orientation\n  .resize({ width: 800 })\n  .avif({ quality: 50 })\n  .toFile("out-800.avif");` },
];
export const LOAD_TECH: T[] = [
  { title: "Lazy loading", tag: "below the fold", desc: "Delay offscreen downloads.",
    code: `<img src="p.webp" width="400" height="400"\n  loading="lazy" decoding="async" alt="">` },
  { title: "LCP / hero image", tag: "above the fold", desc: "Eager + high priority. Never lazy-load it.",
    code: `<img src="hero.avif" width="1600" height="700"\n  loading="eager" fetchpriority="high" alt="">` },
  { title: "next/image", tag: "next.js", desc: "Resizing, formats, srcset and lazy loading built in.",
    code: `<Image src="/p.jpg" alt="" width={800} height={600}\n  sizes="(max-width:600px) 100vw, 50vw"\n  placeholder="blur" />` },
  { title: "Aspect-ratio box", tag: "css", desc: "Reserve space → no layout shift (CLS).",
    code: `.box { aspect-ratio: 1/1; background:#eee }\n.box img { width:100%; height:100%; object-fit:cover }` },
];
export const INFRA_TECH: T[] = [
  { title: "Immutable cache header", tag: "http", desc: "For versioned/hashed image URLs.",
    code: `Cache-Control: public, max-age=31536000, immutable` },
  { title: "Presigned upload (R2/S3)", tag: "node", desc: "Browser uploads straight to storage.",
    code: `const url = await getSignedUrl(s3,\n  new PutObjectCommand({ Bucket, Key }),\n  { expiresIn: 60 });\nawait fetch(url, { method: "PUT", body: file });` },
  { title: "Upload validation", tag: "security", desc: "Check real file type, not just the extension.",
    code: `const meta = await sharp(buf).metadata();\nif (!["jpeg","png","webp"].includes(meta.format!)\n  || meta.width! > 8000) throw new Error("bad image");` },
];
