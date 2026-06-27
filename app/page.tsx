import Link from "next/link";
import { ArrowUpRightIcon, GithubIcon, LinkedinIcon, MailIcon } from "lucide-react";
import type { Metadata } from "next/types";

import { FloatingHeader } from "@/components/navigation/floating-header";
import { ProfileImage } from "@/components/profile-image";
import { ScrollArea } from "@/components/scroll-area";
import Info from "@/components/info";
import { Projects } from "@/components/projects";
import { GitHubActivitySection } from "@/components/github-activity-section";
import { WRITING } from "@/content/writing";
import { USER } from "@/config/user";
import { TechStackSection } from "@/components/tech";
import { Footer } from "@/components/footer";

export const metadata: Metadata = {
  title: `${USER.name} — ${USER.tagline}`,
  description: USER.description,
};

export default function Page() {
  return (
    <>
      <Info show={["time", "screen"]} />

      <ScrollArea useScrollAreaId className="h-screen">
        <FloatingHeader scrollTitle={USER.name} />

        <div className="mx-auto w-full max-w-2xl px-5 pb-32 pt-10 lg:pb-24 lg:pt-20">
          {/* Header */}
          <header className="flex animate-fade-up items-start gap-5">
            <ProfileImage />
            <div className="flex-1 pt-1">
              <h1 className="font-display text-2xl font-semibold tracking-tight text-ink">
                {USER.name}
              </h1>
              <p className="mt-1 font-mono text-sm text-muted">{USER.tagline}</p>
            </div>
          </header>

          {/* About */}
          <section className="mt-10 animate-fade-up [animation-delay:80ms]">
            <p className="font-mono text-[0.7rem] uppercase tracking-[0.15em] text-muted">
              01 / About
            </p>
            <p className="mt-3 max-w-xl leading-7 text-ink/85">
              {USER.description} 
            </p>
            <p className=" max-w-xl leading-7 font-mono  text-muted">
           
          <a
            className="link-underline text-ink"
            href= {USER.Resume.resume}
            target="_blank"
            rel="noopener noreferrer"
          >
            Resume
          </a>
          
        </p>
          </section>

          {/* Activity log */}
          <section className="mt-12 animate-fade-up [animation-delay:140ms]">
            <p className="mb-4 font-mono text-[0.7rem] uppercase tracking-[0.15em] text-muted">
              02 / Activity log
            </p>
            <GitHubActivitySection />
          </section>
          <section className="mt-12 animate-fade-up [animation-delay:170ms]">
  <p className="mb-4 font-mono text-[0.7rem] uppercase tracking-[0.15em] text-muted">
    03 / Tech stack
  </p>
  <TechStackSection />
</section>

          {/* Projects */}
          <section className="mt-12 animate-fade-up [animation-delay:200ms] ">
            <p className="mb-4 font-mono text-[0.7rem] uppercase tracking-[0.15em] text-muted ">
              04 / Projects
            </p>
            <Projects />
          </section>

          {/* Writing */}
          <section className="mt-12 animate-fade-up [animation-delay:260ms]">
            <p className="mb-4 font-mono text-[0.7rem] uppercase tracking-[0.15em] text-muted">
              05 / Writing
            </p>
            <ul className="divide-y divide-line rounded-xl border border-line  group-hover:text-signal">
              {WRITING.map((post) => (
                <li key={post.slug}>
                  <Link
                    href={`/writing/${post.slug}`}
                    className="flex items-center justify-between gap-4 p-4 transition-colors hover:bg-signal/5"
                  >
                    <div>
                      <h3 className="font-display font-medium text-ink ">
                        {post.title}
                      </h3>
                      <p className="mt-1 font-mono text-xs text-muted">
                        {post.date}
                      </p>
                    </div>
                    <ArrowUpRightIcon className="size-4 shrink-0 text-muted" />
                  </Link>
                </li>
              ))}
            </ul>
          </section>

          {/* Contact / footer */}
          <footer className="mt-16 flex flex-col items-start gap-4 border-t border-dashed border-line pt-8 animate-fade-up [animation-delay:320ms]">
            <p className="font-mono text-[0.7rem] uppercase tracking-[0.15em] text-muted">
              06 / Contact
            </p>
            <div className="flex items-center gap-3">
              <Link
                href={USER.social.github}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub"
                className="flex size-9 items-center justify-center rounded-full border border-line text-muted transition-colors hover:text-ink"
              >
                <GithubIcon className="size-4" />
              </Link>
              <Link
                href={USER.social.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
                className="flex size-9 items-center justify-center rounded-full border border-line text-muted transition-colors hover:text-ink"
              >
                <LinkedinIcon className="size-4" />
              </Link>
              <Link
                href={USER.social.email}
                aria-label="Email"
                className="flex size-9 items-center justify-center rounded-full border border-line text-muted transition-colors hover:text-ink"
              >
                <MailIcon className="size-4" />
              </Link>
            </div>
          </footer>
           <Footer />
        </div>
      </ScrollArea>
    </>
  );
}
