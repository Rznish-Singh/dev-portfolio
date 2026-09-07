import type { Metadata } from 'next';
import { craftItems } from './data';
import { CraftCard } from './craft-card';
import { MasonryGrid } from './masonry-grid';

// Renders once at build time — remove this line if you want the list to
// update without a redeploy.
export const dynamic = 'force-static';

export const metadata: Metadata = {
  title: 'Craft',
  description: "A collection of things I've built.",
};

export default function CraftPage() {
  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-12 sm:px-6">
      {/* <h1 className="mb-8 font-bold text-2xl tracking-tight">Craft</h1> */}

      <MasonryGrid breakpoints={{ sm: 1, lg: 2, xl: 3 }}>
        {craftItems.map((item) => (
          <CraftCard
            key={item.slug}
            title={item.title}
            date={new Date(item.date).toLocaleDateString('en-US', {
              month: 'long',
              year: 'numeric',
            })}
            href={item.href ? item.href : `/craft/${item.slug}`}
            src={item.media.src}
            type={item.media.type}
            blurImage={item.media.blurImage}
            craftType={item.type}
            theme={item.theme}
            aspectRatio={item.aspectRatio}
          />
        ))}
      </MasonryGrid>
    </div>
  );
}
