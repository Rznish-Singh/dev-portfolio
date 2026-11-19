import type { ReactNode } from "react";

export type PostSection = { id: string; title: string; content: ReactNode };
export type newpost = { new: boolean };
export type Post = {
  slug: string; // becomes /writing/<slug>
  title: string;
  date: string; // YYYY-MM-DD
  summary: string;
  sections: PostSection[];
  new: boolean; // true if the post is new (published within the last 14 days)
};