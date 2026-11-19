import type { Post } from "@/content/writing";
import { P, Mark, Code, Demo } from "@/components/writing/Prose";
import { Counter } from "@/components/writing/demos/Counter";
import { RznishChatDemo } from "@/components/demovideo/RznishDemo";
// Import anything else you need here: next/image, other components, data files...

export const post: Post = {
  slug: "hello-writing",
  title: "Hello, writing",
  date: "2026-10-03",
  summary: "Why I started writing things down.",
  new:false,
  sections: [
    {
      id: "getting-started",
      title: "Getting started",
      content: (
        <>
          <Code>{`npm install motion`}</Code>
          <P>
            I build in public, so notes live here too. <Mark>Build. Learn. Ship.</Mark>
          </P>
        </>
      ),
    },
    {
      id: "live-demo",
      title: "Live demo",
      content: (
        <>
          <P>This is a real React component rendered inside the post:</P>
          <Demo caption="Click it, it's interactive">
            <Counter />
          </Demo>
          <Code lang="tsx">{`
           import { Counter } from "@/components/writing/demos/Counter";

             <Counter />
             `}</Code>
           </>
      ),
    },
    {
      id: "adding-posts",
      title: "Adding posts",
      content: <P>Create a file in content/writing/posts and register it in index.ts.</P>,
    },
     
    {id: "rznish-demo",
      title: "rznish demo",
      content: (
        <>
        <RznishChatDemo />
        </>
      ),
    },
  ],
};