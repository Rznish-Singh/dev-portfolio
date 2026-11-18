import { TechStackSection } from "@/components/tech";
import { ScrollArea } from "@/components/scroll-area";
import type { Metadata } from 'next';
import { USER } from "@/config/user";
export const metadata: Metadata = {
  title: `Techstack — ${USER.name}`,
  description: "Notes, write-ups, and field notes.",
};


export default function TechStackPage() {
return (
    <ScrollArea useScrollAreaId className="h-screen">
        <div className="mx-auto w-full max-w-2xl px-5 pb-32 pt-10 lg:pb-24 lg:pt-20">
        <p className="font-mono text-[0.7rem] uppercase tracking-[0.15em] text-muted">
          Tech stack
        </p>
        <h1 className="mt-2 font-display text-2xl font-semibold tracking-tight text-ink">
          My tech stack
        </h1>
        <section><TechStackSection /></section>
    
      </div>

</ScrollArea>
);
}