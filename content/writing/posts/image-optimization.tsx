import type { Post } from "@/content/writing";
import { P, Mark, Code, Demo } from "@/components/writing/Prose";
import { Summary } from "@/components/imgopt/Summary";
import { VisitorCount } from "@/components/imgopt/VisitorCount";
import { LatencyDemo } from "@/components/imgopt/LatencyDemo";
import { ResponsiveViz } from "@/components/imgopt/ResponsiveViz";
import { CacheFlow } from "@/components/imgopt/CacheFlow";
import { TechniqueGroup, FORMAT_TECH, LOAD_TECH, INFRA_TECH } from "@/components/imgopt/TechniqueCards";

export const post: Post = {
  slug: "image-optimization",
  title: "Image optimization, end to end",
  date: "2026-11-18",
  summary: "Upload to cache: see the latency difference and copy the syntax.",
  sections: [
    {
      id: "summary",
      title: "Summary",
      content: (
        <>
          <VisitorCount />
          <div className="mt-3"><Summary /></div>
        </>
      ),
    },
    {
      id: "latency",
      title: "Latency: before vs after",
      content: (
        <>
          <P>Same photo, same network. Pick a connection and press load. <Mark>Smaller bytes + a closer cache = faster paint.</Mark></P>
          <Demo caption="Unoptimized vs optimized load"><LatencyDemo /></Demo>
        </>
      ),
    },
    { id: "formats", title: "Formats & processing", content: <TechniqueGroup items={FORMAT_TECH} /> },
    {
      id: "responsive",
      title: "Responsive delivery",
      content: (
        <>
          <P>Avoid downloading a 2000px image for a 350px slot.</P>
          <ResponsiveViz />
          <Code lang="html">{`<img src="p-800.webp"
  srcset="p-400.webp 400w, p-800.webp 800w, p-1200.webp 1200w"
  sizes="(max-width:600px) 100vw, 50vw"
  width="800" height="800" alt="">`}</Code>
        </>
      ),
    },
    { id: "loading", title: "Browser loading & UX", content: <TechniqueGroup items={LOAD_TECH} /> },
    {
      id: "cache",
      title: "CDN & caching",
      content: (
        <>
          <CacheFlow />
          <div className="mt-3"><TechniqueGroup items={INFRA_TECH} /></div>
        </>
      ),
    },
    {
      id: "start-here",
      title: "Start here",
      content: (
        <P>
          Direct upload, object storage, resizing, <Mark>AVIF/WebP</Mark>, CDN caching, srcset, lazy loading and correct
          width/height. Add virtualization and background workers when you actually need them.
        </P>
      ),
    },
  ],
};
