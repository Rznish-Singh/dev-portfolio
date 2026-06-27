export type WritingEntry = {
  slug: string;
  title: string;
  date: string;
  excerpt: string;
};

// Add a matching `app/writing/<slug>/page.mdx` for each entry below.
export const WRITING: WritingEntry[] = [
  
  {
    slug: "WebsiteInformationGathering",
    title: "Website Information Gathering",
    date: " 11 April 2026",
    excerpt:
      "A guide to collecting and analyzing information about websites for research and development purposes.",
  },
];
