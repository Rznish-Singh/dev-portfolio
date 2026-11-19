import Link from "next/link";
import type { Metadata } from "next/types";
import experimentAnimation from "@/public/assets/experiments.json";

import { FloatingHeader } from "@/components/navigation/floating-header";
import { ProfileImage } from "@/components/profile-image";
import { ScrollArea } from "@/components/scroll-area";
import Info from "@/components/info";
import { USER } from "@/config/user";
import { GithubCard } from "@/components/socialmedia/Github Card";
import { InstagramCard } from "@/components/socialmedia/Instagram Card";
import { TwitterCard } from "@/components/socialmedia/Twitter(X) Card";
import { WritingList } from "@/components/writing/WritingList";
import { getPosts } from "@/lib/writing";
import { Footer } from "@/components/footer";
import { GitHubActivityliveline } from "@/components/github-liveline";
import { LinearBlur } from "@/components/ui/LinearBlur";
import { Doodles } from "@/components/doodles";
import { HandNote } from "@/components/hand-note";
import { MobileNotice } from "./MobileNotice";
import { FollowNote } from "@/components/follow-note";
import { GitHubActivitySection } from "@/components/github-activity-section";
import { PixelSwipeText } from "@/components/ui/PixelSwipeText";

export const metadata: Metadata = {
  title: `${USER.name} — ${USER.tagline}`,
  description: USER.description,

};

// Plain muted Inter label, like "Writing" in the reference
const SECTION = "text-base text-muted";

// Same size and colour as the paragraph; thin soft underline that darkens on hover
const LABEL = "font-sans text-base font-normal leading-[1.7] text-ink";

const LINK =
  "font-sans text-base font-normal leading-[1.7] text-ink " +
  "no-underline decoration-ink/30 underline decoration-1 underline-offset-[3px] " +
  "hover:decoration-ink dark:text-ink";

// Mobile: card sits under the whole sentence. Desktop: under its own link.
const POPOVER = "max-sm:left-0 max-sm:w-full max-sm:max-w-80";

export default function Page() {
  return (
    <>

      <Info show={["time", "screen"]} />


      <ScrollArea useScrollAreaId className="h-screen">
        {/* <FloatingHeader scrollTitle={USER.name} /> */}

        <div className="w-full overflow-x-clip">
          <div className="mx-auto w-full max-w-2xl px-5 pb-32 pt-10 font-sans lg:pb-24 lg:pt-20">
            {/* Header */}
            <header className="flex animate-fade-up items-start gap-5">
              <ProfileImage />


              <div className="min-w-0 flex-1 pt-1">
                <h1 className="text-lg font-normal tracking-normal text-ink">
                  {USER.name}
                </h1>
                <p className="mt-1 text-base text-muted">{USER.tagline} </p>
              </div>
            </header>

            {/* About */}
            <section className="relative z-30 mt-10 flex flex-col animate-fade-up [animation-delay:80ms]">
              <p className={SECTION}>About</p>
              <PixelSwipeText
                className="mt-3 block max-w-xl"
                textClassName="text-base leading-[1.7] text-ink"
                wipeColor="#e6e6e4"
                wipeColorDark="#2e2e2e"
                trailWipeColor="#f4f4f2"
                trailWipeColorDark="#1f1f1f"
                speed={0.7}
              >
                <p className="mt-3 max-w-xl text-base leading-[1.7] text-ink">

                  {USER.description}

                </p>
              </PixelSwipeText>
              <p className="mt-3 max-w-xl text-base leading-[1.7] text-ink">
                <PixelSwipeText
                  className="mt-3 block max-w"
                  textClassName="text-base leading-[1.7] text-ink"
                  wipeColor="#e6e6e4"
                  wipeColorDark="#2e2e2e"
                  trailWipeColor="#f4f4f2"
                  trailWipeColorDark="#1f1f1f"
                  speed={0.7}
                  delay={300}
                >
                  my live project , so you see in craft page
                 
                  <div className="inline-flex items-center ">
                    <a
                    className="link-underline text-ink px-2.5"
                    href="\craft"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Craft
                  </a>
                  <video
                      src="/assets/Fire.webm"
                      autoPlay
                      loop
                      muted
                      className="h-8 w-10 rotate-0" 
                    />
                  </div>
                  
                  <div className="inline-flex items-center gap-0">  <a
                    className="link-underline text-ink px-2.5"
                    href="\craft"
                    target="_blank"
                    rel="noopener noreferrer"
                  >   Experiments
                  </a>
                    <img
                      src="/assets/experiment.svg"
                      alt=""
                      className="h-10 w-10 rotate-310" 
                    />
                  </div>


                </PixelSwipeText>

              </p>

              {/* Socials: one sentence that wraps like normal text */}

              <div className="relative mt-4 flex flex-row flex-wrap items-center gap-x-1.5">

                <FollowNote />
                <TwitterCard
                  username="rznishsingh"
                  name="Rajnish Singh"
                  text="You can reach out to me on"
                  linkText="X"
                  enableCardTilt={false}
                  className="gap-1.5"
                  labelClassName={LABEL}
                  linkClassName={LINK}
                  popoverClassName={POPOVER}
                />

                <GithubCard
                  username="rznish-singh"
                  name="Rajnish Singh"
                  year={2026}
                  themeScheme="green"
                  text="or see more of my work on"
                  linkText="GitHub"
                  enableCardTilt={false}
                  className="gap-1.5"
                  labelClassName={LABEL}
                  linkClassName={LINK}
                  popoverClassName={POPOVER}
                />

                <InstagramCard
                  username="rznishsingh"
                  name="Rajnish Singh"
                  avatarUrl="/avatar/insta.png"
                  bio="Developer & photographer. Build. Learn. Ship."
                  posts="2"
                  followers="0"
                  following="0"
                  text="and"
                  linkText="Instagram"
                  enableCardTilt={false}
                  className="gap-1.5"
                  labelClassName={LABEL}
                  linkClassName={LINK}
                  popoverClassName={POPOVER}
                />
              </div>

            </section>

            {/* Activity log */}
            <section className="mt-14 animate-fade-up [animation-delay:140ms]">
              <p className={`mb-4 ${SECTION}`}>Activity log</p>
              <div className="w-full min-w-0 max-w-full">
                <GitHubActivityliveline />

              </div><div className=" mt-4 py-10 text-sm text-muted"><GitHubActivitySection /></div>

              <HandNote className="top-32">this is showing github contribution activity</HandNote>
            </section>

            {/* Writing */}
            <section className="mt-1 flex flex-col animate-fade-up [animation-delay:160ms]">
              <p className={SECTION}>Writing</p>

              <div className="mt-1">
                <WritingList limit={5} bordered={true} />
              </div>

              {getPosts().length > 5 && (
                <Link
                  href="/writing"
                  className="mt-4 self-start text-base text-ink underline decoration-ink/30 decoration-1 underline-offset-[3px] hover:decoration-ink"
                >
                  View all writing
                </Link>
              )}
            </section>

            <Footer />
          </div>
        </div>
        {/* <LinearBlur
        side="bottom"
        strength={127}
        steps={12.4}
        falloffPercentage={100}
        tint="#45454500"
        className="fixed inset-x-0 bottom-0 z-40 h-24"
      /> */}

      </ScrollArea>
      {/* <Doodles /> */}

    </>
  );
}