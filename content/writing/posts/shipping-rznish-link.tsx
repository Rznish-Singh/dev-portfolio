import type { Post } from "../types";
import { P } from "@/components/writing/Prose";

export const post: Post = {
  slug: "shipping-rznish-link",
  title: "Shipping rznish.link",
  date: "2025-05-23",
  summary: "Notes from building a URL shortener.",
  sections: [
    {
      id: "overview",
      title: "Overview",
      content: <P>A Java backend and a Next.js frontend.</P>,
    },
  ],
};