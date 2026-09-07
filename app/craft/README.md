# Craft — drop-in `/craft` section

A self-contained gallery page for your portfolio: a masonry grid of cards
(image or video) that link either to a live project (external URL) or to a
simple built-in write-up page. Everything lives in one folder — no shared
design system, no analytics, no MDX pipeline, no SEO/JSON-LD scaffolding.
Just the pieces needed to make `/craft` work.

## 1. Install

Copy the whole `app/craft` folder into your project's `app/` directory, so
you end up with:

```
your-portfolio/
  app/
    craft/
      data.ts          👈 edit this to add your own projects
      utils.ts
      masonry-grid.tsx
      craft-card.tsx
      page.tsx
      [slug]/
        page.tsx
```

Install the two small dependencies it uses (skip any you already have):

```bash
npm install clsx tailwind-merge lucide-react
```

Requires Tailwind CSS (any recent v3 or v4 setup) and the Next.js App
Router — both of which a typical portfolio already has.

## 2. Add your own projects

Open `app/craft/data.ts` and edit the `craftItems` array. Each item is:

```ts
{
  slug: 'my-project',              // used for /craft/my-project
  title: 'My Project',
  date: '2025-06-01',
  href: 'https://my-live-site.com', // optional — external link
  type: 'project',                  // 'project' | 'component' | 'article' | 'none'
  media: { type: 'image', src: '/craft/my-project.png' },
  theme: 'light',                   // 'light' | 'dark' — text contrast over the media
  aspectRatio: 4 / 3,
  description: 'One line about it.',
  content: 'Optional longer write-up...', // only used when `href` is not set
}
```

- **With `href` set** → the card's button opens that link directly.
- **Without `href`** → the card links to `/craft/[slug]`, a simple page
  built from `content` (plain paragraphs, split on blank lines).

Drop your images/videos in `public/craft/` and reference them as
`/craft/your-file.png` in `media.src`.

## 3. That's it

Visit `/craft` on your site (e.g. `raa.vercel.app/craft`) and it will list
whatever is in `data.ts`. Delete the two example entries once you've added
your own.

## What was left out on purpose

The original site's craft section is wired into a monorepo design system,
Fumadocs MDX rendering, custom SEO/OG-image generation, JSON-LD, analytics,
and RSS/llms.txt feeds. None of that is needed for a portfolio's own
`/craft` page, so it isn't included here — you get a plain `<title>` +
`<meta description>` per page and nothing else. If you want any of that
back later (OG images, JSON-LD, etc.), it's easy to layer on top of this
same `data.ts`.
