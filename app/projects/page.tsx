import { ScrollArea } from "@/components/scroll-area";
import { Projects } from "@/components/projects";
export default function ProjectsPage() {
  return (
    <ScrollArea useScrollAreaId className="h-screen">
      <div className="mx-auto w-full max-w-2xl px-5 pb-32 pt-10 lg:pb-24 lg:pt-20">
        <p className="font-mono text-[0.7rem] uppercase tracking-[0.15em] text-muted">
          Projects
        </p>
        <section><Projects /></section>
        </div>
    </ScrollArea>
    );
} 