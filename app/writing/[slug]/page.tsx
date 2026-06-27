import Link from "next/link";
import { ArrowLeftIcon } from "lucide-react";
import { notFound } from "next/navigation";
import type { Metadata } from "next/types";

import { ScrollArea } from "@/components/scroll-area";
import { FloatingHeader } from "@/components/navigation/floating-header";
import { WRITING } from "@/content/writing";
import { USER } from "@/config/user";


import WebsiteInformationGathering from "@/content/posts/WebsiteInformationGathering.mdx";

const POSTS: Record<string, React.ComponentType> = {
  
  "WebsiteInformationGathering":  WebsiteInformationGathering,
};

export function generateStaticParams() {
  return WRITING.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const entry = WRITING.find((post) => post.slug === slug);
  if (!entry) return {};
  return {
    title: `${entry.title} — ${USER.name}`,
    description: entry.excerpt,
  };
}

export default async function WritingPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const entry = WRITING.find((post) => post.slug === slug);
  const PostBody = POSTS[slug];

  if (!entry || !PostBody) {
    notFound();
  }

  return (
    <ScrollArea useScrollAreaId className="h-screen">
      <FloatingHeader title="Writing" />

      <article className="mx-auto w-full max-w-2xl px-5 pb-32 pt-10 lg:pb-24 lg:pt-20">
        <Link
          href="/writing"
          className="mb-8 inline-flex items-center gap-1.5 font-mono text-xs text-muted transition-colors hover:text-ink"
        >
          <ArrowLeftIcon className="size-3.5" />
          All writing
        </Link>

        <p className="font-mono text-xs text-muted">{entry.date}</p>
        <h1 className="mt-2 font-display text-2xl font-semibold tracking-tight text-ink">
          {entry.title}
        </h1>

        <div className="mt-8">
          <PostBody />
        </div>
      </article>
    </ScrollArea>
  );
}
