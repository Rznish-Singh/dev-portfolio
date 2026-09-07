// ─────────────────────────────────────────────────────────────────────────
// 👉 THIS IS THE ONLY FILE YOU NEED TO EDIT.
// Add / remove / reorder items in `craftItems` to control what shows up on
// /craft. Everything else in this folder is just plumbing.
// ─────────────────────────────────────────────────────────────────────────

export type CraftType = 'project' | 'component' | 'article' | 'none';

export interface CraftItem {
  /** URL-safe id, used for /craft/[slug]. Must be unique. */
  slug: string;
  /** Card + page title. */
  title: string;
  /** ISO date string, e.g. '2025-06-01'. Only month + year are shown. */
  date: string;
  /**
   * Optional external link (a live deployed project, GitHub repo, etc).
   * If set, the card's button opens this link directly instead of the
   * built-in /craft/[slug] write-up page.
   */
  href?: string;
  /**
   * Controls the button label on the card:
   * 'project'   -> "View Live"
   * 'component' -> "View Prototype"
   * 'article'   -> "Read Article"
   * 'none'      -> hides the button entirely
   */
  type: CraftType;
  media: {
    type: 'image' | 'video';
    /** Path under /public, e.g. '/craft/my-project.png'. */
    src: string;
    /** Optional low-res placeholder shown while a video loads. */
    blurImage?: string;
  };
  /** Controls title/date text color so it stays readable on the media. */
  theme?: 'light' | 'dark';
  /** width / height. Defaults to 4/3. */
  aspectRatio?: number;
  /** One-line summary, used for the detail page's meta description. */
  description?: string;
  /**
   * Optional longer write-up shown at /craft/[slug] (only used when `href`
   * is NOT set). Separate paragraphs with a blank line.
   */
  content?: string;
}

export const craftItems: CraftItem[] = [
  {
    slug: 'rznishai-docs',
    title: 'rznishai docs',
    date: '2025-06-01',
    href: 'https://rznishai.vercel.app/',
    type: 'project',
    media: {
      type: 'video',
      src: '/craft/rznishai.mp4',
    },
    
    theme: 'light',
    aspectRatio: 6/ 3,
    description: 'A one-line summary of what this project does.',
  },
   {
    slug: 'rznishragv1',
    title: 'rznishrag v1',
    date: '2025-06-01',
    href: 'http://13.203.230.44/',
    type: 'project',
    media: {
      type: 'image',
      src: '/craft/image.png',
    },
    
    theme: 'light',
    aspectRatio: 6/ 3,
    description: 'A one-line summary of what this project does.',
  },
   {
    slug: 'rznish dev-portfolio',
    title: 'rznish dev-portfolio',
    date: '2025-06-01',
    href: 'https://rznish.vercel.app/',
    type: 'project',
    media: {
      type: 'video',
      src: '/craft/devportfolio.mp4',
    },
    
    theme: 'light',
    aspectRatio: 4 / 3,
    description: 'A one-line summary of what this project does.',
  },

   {
    slug: '14 feb 2019',
    title: '14 feb 2019',
    date: '2025-06-01',
    href: 'https://14-02-2019.netlify.app/',
    type: 'project',
    media: {
      type: 'video',
      src: '/craft/14feb.mp4',
    },
    
    theme: 'light',
    aspectRatio: 4 / 3,
    description: 'A one-line summary of what this project does.',
  },
   {
    slug: 'blog',
    title: 'blog',
    date: '2025-06-01',
    href: 'https://rznish-blog.vercel.app/',
    type: 'project',
    media: {
      type: 'video',
      src: '/craft/blog.mp4',
    },
    
    theme: 'light',
    aspectRatio: 4 / 3,
    description: 'A one-line summary of what this project does.',
  },
   {
    slug: 'creative portfolio',
    title: 'Creative Portfolio',
    date: '2025-06-01',
    href: 'https://rznish-portfolio.vercel.app/',
    type: 'project',
    media: {
      type: 'video',
      src: '/craft/creativeportfolio.mp4',
    },
    
    theme: 'light',
    aspectRatio: 4 / 3,
    description: 'A one-line summary of what this project does.',
  },
   {
    slug: 'chatapp landing page',
    title: 'ChatApp Landing Page',
    date: '2025-06-01',
    href: 'https://rznish-demo.vercel.app/',
    type: 'project',
    media: {
      type: 'video',
      src: '/craft/chatapp.mp4',
    },
    
    theme: 'light',
    aspectRatio: 4 / 3,
    description: 'A one-line summary of what this project does.',
  },
  {
    slug: 'insurance-landing-page',
    title: 'Insurance Landing Page',
    date: '2025-06-01',
    href: 'https://eazyinsurance.vercel.app/',
    type: 'project',
    media: {
      type: 'video',
      src: '/craft/eazyinsurance.mp4',
    },
    
    theme: 'light',
    aspectRatio: 4 / 3,
    description: 'A one-line summary of what this project does.',
  },
   {
    slug: 'compiler',
    title: 'Compiler project',
    date: '2025-06-01',
    href: 'https://esmart-compiler.vercel.app/',
    type: 'project',
    media: {
      type: 'video',
      src: '/craft/compiler.mp4',
    },
    
    theme: 'light',
    aspectRatio: 4 / 3,
    description: 'A one-line summary of what this project does.',
  },
  
   {
    slug: 'expensewise-dashboard',
    title: 'ExpenseWise Dashboard',
    date: '2025-06-01',
    href: 'https://expensewiseaaa.vercel.app/sign-in?redirect_url=https%3A%2F%2Fexpensewiseaaa.vercel.app%2F',
    type: 'project',
    media: {
      type: 'video',
      src: '/craft/expensewise.mp4',
    },
    
    theme: 'light',
    aspectRatio: 4 / 3,
    description: 'A one-line summary of what this project does.',
  },
  {
    slug: 'expensewise-landing-page',
    title: 'ExpenseWise Landing Page',
    date: '2025-06-01',
    href: 'https://landingpage-expensewise.vercel.app/',
    type: 'project',
    media: {
      type: 'video',
      src: '/craft/landingpage.mp4',
    },
    
    theme: 'light',
    aspectRatio: 4 / 3,
    description: 'A one-line summary of what this project does.',
  },
  {
    slug: 'website-landing-page',
    title: 'Website Landing Page',
    date: '2025-06-01',
    href: 'https://elementium-xi.vercel.app/',
    type: 'project',
    media: {
      type: 'video',
      src: '/craft/elementum.mp4',
    },
    
    theme: 'light',
    aspectRatio: 4 / 3,
    description: 'A one-line summary of what this project does.',
  },
  {
    slug: 'old-portfolio',
    title: 'Old Portfolio',
    date: '2025-06-01',
    href: 'https://rznish.netlify.app/',
    type: 'project',
    media: {
      type: 'video',
      src: '/craft/oldportfolio.mp4',
    },
    
    theme: 'light',
    aspectRatio: 4 / 4,
    description: 'A one-line summary of what this project does.',
  },
//   {
//     slug: 'example-writeup',
//     title: 'Example Write-up',
//     date: '2025-05-10',
//     type: 'article',
//     media: {
//       type: 'image',
//       src: '/craft/example-writeup.png',
//     },
//     theme: 'dark',
//     aspectRatio: 4 / 3,
//     description: 'A short project without an external link, with its own /craft/[slug] page.',
//     content: `This paragraph becomes the first paragraph on the detail page.

// Add as many paragraphs as you like, each separated by a blank line.`,
//   },

  // 👉 Copy one of the objects above to add your own project.
];
