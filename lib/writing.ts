import { posts, type Post } from "@/content/writing";

const byNewest = [...posts].sort((a, b) => b.date.localeCompare(a.date));

export const getPosts = () => byNewest;
export const getPost = (slug: string) => posts.find((p) => p.slug === slug);

export function groupByYear(limit?: number): { year: string; posts: Post[] }[] {
  const list = limit ? byNewest.slice(0, limit) : byNewest;
  const map = new Map<string, Post[]>();
  for (const post of list) {
    const year = post.date.slice(0, 4);
    map.set(year, [...(map.get(year) ?? []), post]);
  }
  return [...map].map(([year, posts]) => ({ year, posts }));
}

// UTC + fixed locale so server and client render the same text
const utc = { timeZone: "UTC" } as const;

export const formatShort = (iso: string) =>
  new Intl.DateTimeFormat("en-GB", { ...utc, day: "2-digit", month: "2-digit" }).format(new Date(iso));

export const formatLong = (iso: string) =>
  new Intl.DateTimeFormat("en-GB", { ...utc, day: "numeric", month: "long", year: "numeric" })
    .format(new Date(iso))
    .replace(/ (\d{4})$/, ", $1"); // 29 July, 2026