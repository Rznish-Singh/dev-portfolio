import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getPost, getPosts, formatLong } from "@/lib/writing";
import { PostBar, PostSidebar } from "@/components/writing/PostToc";

type Props = { params: Promise<{ slug: string }> };

export const generateStaticParams = () => getPosts().map((p) => ({ slug: p.slug }));

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const post = getPost((await params).slug);
  return post ? { title: post.title, description: post.summary } : {};
}

export default async function PostPage({ params }: Props) {
  const post = getPost((await params).slug);
  if (!post) notFound();

  const items = post.sections.map(({ id, title }) => ({ id, title }));

  return (
    <article className="relative">
      {/* Large screens: sticky sidebar in the left margin */}
      <aside className="absolute inset-y-0 right-full mr-14 hidden w-44 xl:block">
        <div className="sticky top-20">
          <PostSidebar title={post.title} items={items} />
        </div>
      </aside>

      {/* Small screens: sticky bar */}
      <PostBar items={items} />

      <header>
        <h1 className="text-ink">{post.title}</h1>
        <p className="mt-1 text-muted">{formatLong(post.date)}</p>
        <p className="mt-6 leading-7 text-ink/85">{post.summary}</p>
      </header>

      <div className="mt-12 flex flex-col gap-14 sm:mt-16 sm:gap-20">
        {post.sections.map((s) => (
          <section key={s.id} id={s.id} className="scroll-mt-20 sm:scroll-mt-24">
            <h2 className="mb-5 flex items-center gap-3 text-sm font-medium text-ink after:h-px after:flex-1 after:bg-line sm:mb-6">
              {s.title}
            </h2>
            <div className="flex flex-col gap-5">{s.content}</div>
          </section>
        ))}
      </div>
    </article>
  );
}