import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { craftItems } from '../data';

export const dynamic = 'force-static';
export const dynamicParams = false;

// Only items WITHOUT an external `href` get a page here — items with an
// href send visitors straight to that link instead.
export function generateStaticParams() {
  return craftItems.filter((item) => !item.href).map((item) => ({ slug: item.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const item = craftItems.find((p) => p.slug === slug);
  if (!item) return {};
  return { title: `${item.title} | Craft`, description: item.description };
}

export default async function CraftDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const item = craftItems.find((p) => p.slug === slug);

  if (!item || item.href) notFound();

  const paragraphs = (item.content ?? '').split(/\n\s*\n/).filter(Boolean);

  return (
    <div className="mx-auto w-full max-w-2xl px-4 py-12 sm:px-6">
      <Link
        href="/craft"
        className="text-neutral-500 text-sm hover:underline dark:text-neutral-400"
      >
        ← Back to Craft
      </Link>

      <h1 className="mt-4 mb-1 font-bold text-2xl tracking-tight">{item.title}</h1>
      <p className="mb-8 text-neutral-500 text-sm dark:text-neutral-400">
        {new Date(item.date).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
      </p>

      <div className="space-y-4 text-base leading-relaxed">
        {paragraphs.length > 0 ? (
          paragraphs.map((p, i) => <p key={i}>{p}</p>)
        ) : (
          <p className="text-neutral-500 dark:text-neutral-400">
            No write-up yet — add one via the <code>content</code> field in{' '}
            <code>data.ts</code>.
          </p>
        )}
      </div>
    </div>
  );
}
