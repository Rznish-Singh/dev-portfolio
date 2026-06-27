# Dev Portfolio

A personal developer portfolio built with **Next.js (App Router)**, **Tailwind CSS v4**, and **MDX** for long-form writing. Monochrome "activity log" aesthetic — paper background, monospace data labels, one signal-blue accent reserved for interactive states and the live GitHub activity cursor.

## Stack

- Next.js 15 (App Router, React 19)
- Tailwind CSS v4 (CSS-variable driven theme, see `app/globals.css`)
- MDX for `/writing` posts (native Next.js MDX support, no CMS)
- Self-hosted fonts via `@fontsource` (Space Grotesk, Inter, JetBrains Mono) — no build-time network fetch required
- A handful of small local UI primitives (tooltip, drawer, collapsible) instead of a big component library

## Getting started

```bash
npm install
npm run dev
```

Open http://localhost:3000.

## Customize it

Everything personal lives in a few files — start here:

| What | File |
|---|---|
| Your name, tagline, bio, GitHub username, social links | `config/user.ts` |
| Nav links + social icons in the dock/drawer | `config/site.ts` |
| Projects list | `config/projects.ts` |
| Writing index (title/date/excerpt) | `content/writing.ts` |
| Writing post content | `content/posts/*.mdx` (add a matching entry to `content/writing.ts` and import it in `app/writing/[slug]/page.tsx`) |
| Profile picture | replace `public/avatar.svg`, then update `USER.image.profile` in `config/user.ts` |
| Colors, fonts, spacing | `app/globals.css` (`@theme inline` block) |

### GitHub activity log

The calendar on the homepage fetches public contribution data from the [jogruber/github-contributions-api](https://github.com/grubersjoe/github-contributions-api), cached for a day via `unstable_cache`. Set your username in `config/user.ts` (`USER.github.username`). No API key needed. If the request fails (e.g. offline, or the username has no public contributions), the section shows a graceful fallback instead of crashing the build.

### Adding a new writing post

1. Create `content/posts/your-slug.mdx` with your content.
2. Add `{ slug: "your-slug", title, date, excerpt }` to `content/writing.ts`.
3. Import it and add it to the `POSTS` map in `app/writing/[slug]/page.tsx`.

### Deploying

Works out of the box on Vercel, or anywhere that runs Next.js (`npm run build && npm run start`). No environment variables are required; `GITHUB_CONTRIBUTIONS_API_URL` is optional if you want to point at a self-hosted instance of the contributions API.

## Project structure

```
app/
  layout.tsx              root layout
  page.tsx                homepage
  writing/page.tsx         writing index
  writing/[slug]/page.tsx  individual post (maps slug -> MDX module)
components/
  navigation/              dock (desktop), floating header + drawer (mobile)
  ui/                      small local primitives (button, tag, tooltip, drawer, collapsible, panel)
  github-activity*.tsx     the contribution calendar
  project-item.tsx, projects.tsx
config/                    your editable content (user, site, projects)
content/                   writing index + MDX post bodies
lib/                       utils, hooks, cached data fetcher
```
