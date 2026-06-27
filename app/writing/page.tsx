import Link from "next/link";
import { ArrowUpRightIcon } from "lucide-react";
import type { Metadata } from "next/types";

import { ScrollArea } from "@/components/scroll-area";
import { FloatingHeader } from "@/components/navigation/floating-header";
import { WRITING } from "@/content/writing";
import { USER } from "@/config/user";

export const metadata: Metadata = {
  title: `Writing — ${USER.name}`,
  description: "Notes, write-ups, and field notes.",
};

export default function WritingPage() {
  return (
    <ScrollArea useScrollAreaId className="h-screen">
      <FloatingHeader title="Writing" />

      <div className="mx-auto w-full max-w-2xl px-5 pb-32 pt-10 lg:pb-24 lg:pt-20">
        <p className="font-mono text-[0.7rem] uppercase tracking-[0.15em] text-muted">
          Writing
        </p>
        <h1 className="mt-2 font-display text-2xl font-semibold tracking-tight text-ink">
          Notes &amp; field reports
        </h1>

        <ul className="mt-8 divide-y divide-line border-t border-line">
          {WRITING.map((post) => (
            <li key={post.slug}>
              <Link
                href={`/writing/${post.slug}`}
                className="group flex items-start justify-between gap-4 py-5 transition-colors"
              >
                <div>
                  <p className="font-mono text-xs text-muted">{post.date}</p>
                  <h2 className="mt-1 font-display text-lg font-medium text-ink group-hover:text-signal">
                    {post.title}
                  </h2>
                  <p className="mt-1 text-sm text-ink/70">{post.excerpt}</p>
                </div>
                <ArrowUpRightIcon className="mt-1 size-4 shrink-0 text-muted transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-signal" />
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </ScrollArea>
  );
}
