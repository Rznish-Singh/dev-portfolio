import type { Post } from "@/content/writing";
import { P, Mark, Demo } from "@/components/writing/Prose";
import { HeadingActions } from "@/components/imgopt/LiveVisitors";

import { Note } from "@/components/imgopt/Note";
import { Ref } from "@/components/imgopt/Refs";
import { LatencyDemo } from "@/components/imgopt/LatencyDemo";
import { ResponsiveViz } from "@/components/imgopt/ResponsiveViz";
import { CacheFlowDemo } from "@/components/imgopt/CacheFlowDemo";
import { TechniqueGroup, FORMAT_TECH, LOAD_TECH, INFRA_TECH } from "@/components/imgopt/TechniqueCards";
import { FormatDemo, PriorityDemo, CdnDemo, BlurUpDemo, ShiftDemo, VirtualDemo, PipelineDemo, DocTable } from "@/components/imgopt/Demos";

// Small label inside a section. A <p>, not a heading, so it stays out of the table of contents.
const Sub = ({ children }: { children: React.ReactNode }) => (
  <p className="mb-1 mt-7 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">{children}</p>
);

export const post: Post = {
  slug: "image-optimization",
  title: "Image optimization",
  date: "2026-11-19",
  new: true,
  summary: "How to make images load fast, from upload to cache, with live demos.",
  sections: [
    {
      id: "overview",
      title: "Overview",
      content: (
        <div className="relative">
          
          {/* Move <HeadingActions /> next to your page's h1 if your template allows it */}
          <div className="mb-4"><HeadingActions /></div>
          <P>
            A CDN and WebP are a good start, but not enough. Fix the whole path: format, size, CDN, cache, loading order, placeholders and measuring.{" "}
            <Mark>The fastest image is not the smallest one. It is the right size, at the right time, from the closest cache.</Mark>
          </P>
          <Demo caption="The path every image takes. Each step can save time."><PipelineDemo /></Demo>
          <Note>start with the big wins, not all 10 ideas</Note>
          <Sub>How much time you can save</Sub>
          <Demo caption="Unoptimized vs optimized"><LatencyDemo /></Demo>
        </div>
      ),
    },
    {
      id: "format",
      title: "Format",
      content: (
        <>
          <P>Use AVIF for photos and WebP as the fallback. Keep JPEG or PNG as a last backup, and SVG for logos and icons. The browser picks the first format it supports.</P>
          <Demo caption="Same photo in three formats"><FormatDemo /></Demo>
          <DocTable head={["Format", "Best use"]} rows={[
            ["AVIF", "Photos, banners, big thumbnails"], ["WebP", "General images and thumbnails"], ["JPEG", "Fallback for photos"],
            ["PNG", "Transparency or lossless images"], ["SVG", "Logos, icons, illustrations"],
          ]} />
          <div className="mt-3"><TechniqueGroup items={FORMAT_TECH} /></div>
        </>
      ),
    },
    {
      id: "size",
      title: "Size",
      content: (
        <div className="relative">
          <P>
            Say you have a 2400 × 1600 image. A desktop needs about 1200 wide, a tablet 700 and a phone 400. Give the browser several sizes and tell it how wide the image will be.
            It picks the smallest one that is big enough. Learn more in <Ref id="mdn" />.
          </P>
          <ResponsiveViz />
          <Note>this alone can cut data by 80%</Note>
        </div>
      ),
    },
    {
      id: "loading",
      title: "Loading",
      content: (
        <>
          <P>
            A shop page can have 1 hero, 20 product images and 5 footer images. Load the hero at once with high priority and let the rest wait. Never lazy-load the main image,
            and never mark every image high priority. See <Ref id="lcp" /> and <Ref id="lazy" />.
          </P>
          <Demo caption="What loads first, and what waits for the scroll"><PriorityDemo /></Demo>
          <div className="mt-3"><TechniqueGroup items={LOAD_TECH} /></div>
        </>
      ),
    },
    {
      id: "cdn-cache",
      title: "CDN and cache",
      content: (
        <div className="relative">
          <P>
            An image CDN makes the right size and format from one original. Popular choices: <Ref id="cloudflare" />, <Ref id="imgix" />, <Ref id="imagekit" /> and <Ref id="cloudinary" />.
          </P>
          <Demo caption="One original, many ready-made versions"><CdnDemo /></Demo>
          <Sub>Caching</Sub>
          <P>The first visit is slow. After that, the CDN and the browser keep a copy.</P>
          <Demo caption="Press Reload: slow the first time, 0 ms the second time. Press Clear to start again."><CacheFlowDemo /></Demo>
          <Note>browser cache and CDN cache are not the same</Note>
          <div className="mt-3"><TechniqueGroup items={INFRA_TECH} /></div>
        </div>
      ),
    },
    {
      id: "rendering",
      title: "Rendering",
      content: (
        <>
          <Sub>Placeholder</Sub>
          <P>Show a tiny blurred preview first, then fade in the real image. It feels faster. Keep it very small.</P>
          <Demo caption="Placeholder, transition, final image"><BlurUpDemo /></Demo>
          <Sub>Reserve the space</Sub>
          <P>Set width and height, or an aspect ratio, so the page does not jump when the image arrives.</P>
          <Demo caption="Left: the text jumps. Right: nothing moves."><ShiftDemo /></Demo>
          <Sub>Long lists</Sub>
          <P>With 500 images, keep only the visible ones on the page. Try <Ref id="tanstack" /> or <Ref id="reactwindow" />.</P>
          <Demo caption="500 items in the DOM vs 12"><VirtualDemo /></Demo>
        </>
      ),
    },
    {
      id: "measure",
      title: "Measure",
      content: (
        <>
          <P>
            Do not trust how fast it feels on your own network. Use <Ref id="pagespeed" />, <Ref id="lighthouse" /> and the <Ref id="network" />. More reading: <Ref id="webdev" />.
          </P>
          <DocTable head={["Metric", "What it shows", "Target"]} rows={[
            ["LCP", "How fast the main content loads", "2.5 s or less"], ["CLS", "How stable the layout is", "0.1 or less"],
            ["INP", "How fast the page reacts", "200 ms or less"], ["Transfer size", "Real bytes downloaded", "As small as looks good"],
          ]} />
          <Sub>What to do first</Sub>
          <DocTable head={["#", "Technique", "Impact"]} rows={[
            ["1", "CDN + automatic AVIF/WebP", "Very high"], ["2", "Responsive images (srcset + sizes)", "Very high"], ["3", "Lazy loading below the fold", "Very high"],
            ["4", "Prioritize the main (LCP) image", "Very high"], ["5", "Browser and CDN caching", "Very high"], ["6", "Correct width, height, aspect ratio", "High"],
            ["7", "Blur or BlurHash placeholders", "High for UX"], ["8", "Virtualized image grids", "High for big galleries"], ["9", "Async decoding", "Sometimes"], ["10", "Preload critical images", "Sometimes"],
          ]} />
          <P>Do not compress every image to the lowest quality, and do not lazy-load every image. Both can make things worse.</P>
        </>
      ),
    },
  ],
};