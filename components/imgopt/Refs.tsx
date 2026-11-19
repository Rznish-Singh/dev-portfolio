"use client";
import { NotionMentionLink, type NotionMentionLinkMetadata } from "@/components/ui/notion-mention-link";

// Static metadata, so no /api/notion-mention-link endpoint is needed. Add an entry to reference a new link.
const m = (url: string, title: string, siteName: string, description: string): NotionMentionLinkMetadata => ({
  url, title, siteName, description, domain: new URL(url).hostname.replace(/^www\./, ""),
});

const REFS = {
  webdev: m("https://web.dev/learn/images/", "Learn Images", "web.dev", "A free course on image formats, sizes, loading and delivery."),
  mdn: m("https://developer.mozilla.org/en-US/docs/Web/HTML/Guides/Responsive_images", "Responsive images", "MDN", "How srcset, sizes and the picture element work."),
  lcp: m("https://web.dev/articles/optimize-lcp", "Optimize LCP", "web.dev", "How to make the main content of your page load faster."),
  lazy: m("https://web.dev/articles/browser-level-image-lazy-loading", "Browser-level image lazy loading", "web.dev", "Lazy load images with one attribute."),
  pagespeed: m("https://pagespeed.web.dev/", "PageSpeed Insights", "Google", "Measures Core Web Vitals and finds loading problems."),
  lighthouse: m("https://developer.chrome.com/docs/lighthouse/", "Lighthouse", "Chrome for Developers", "Audits image sizing, loading and performance."),
  network: m("https://developer.chrome.com/docs/devtools/network/", "Network panel", "Chrome DevTools", "See image sizes, cache hits, timing and priority."),
  cloudflare: m("https://developers.cloudflare.com/images/", "Cloudflare Images", "Cloudflare", "Image resizing, optimization and delivery."),
  imgix: m("https://imgix.com/", "Imgix", "Imgix", "Dynamic image transformations through URL parameters."),
  imagekit: m("https://imagekit.io/", "ImageKit", "ImageKit", "Automatic format conversion, resizing and optimization."),
  cloudinary: m("https://cloudinary.com/", "Cloudinary", "Cloudinary", "Image transformations and media management."),
  tanstack: m("https://tanstack.com/virtual", "TanStack Virtual", "TanStack", "Headless virtualization for long lists and grids."),
  reactwindow: m("https://github.com/bvaughn/react-window", "react-window", "GitHub", "Render only the visible rows of a big list."),
} as const;

export type RefId = keyof typeof REFS;

// Hover: soft off-white pill (soft dark grey in dark mode), and the link title turns Apple blue with a matching underline.
const HOVER = [
  "hover:bg-[#EDEDF0] focus-visible:bg-[#EDEDF0] dark:hover:bg-[#3A3A3C] dark:focus-visible:bg-[#3A3A3C]",
  "[&>span:last-child]:transition-colors",
  "hover:[&>span:last-child]:text-[#0066CC] hover:[&>span:last-child]:decoration-[#0066CC]",
  "dark:hover:[&>span:last-child]:text-[#2997FF] dark:hover:[&>span:last-child]:decoration-[#2997FF]",
].join(" ");

export function Ref({ id }: { id: RefId }) {
  const meta = REFS[id];
  return <NotionMentionLink url={meta.url} metadata={meta} prefetch="hover" className={HOVER} />;
}
