import type { ReactNode } from "react";

export type PostSection = { id: string; title: string; content: ReactNode };

export type Post = {
  slug: string; // becomes /writing/<slug>
  title: string;
  date: string; // YYYY-MM-DD
  summary: string;
  sections: PostSection[];
};