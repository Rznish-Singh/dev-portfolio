import { USER } from "@/config/user";
import Image from "next/image";

export const SelfImage = () => (
  <Image
    src={USER.image.profile}
    width={64}
    height={64}
    priority
    className="rounded-full bg-ink"
    alt={`A photo of ${USER.name}`}
  />
);

export const ProfileImage = () => {
  return (
    <div className="relative size-20 shrink-0">
      <img
        src={USER.image.profile}
        fetchPriority="high"
        className="h-full w-full select-none rounded-full bg-ink ring-1 ring-line ring-offset-2 ring-offset-paper"
        alt={`Profile of ${USER.name}`}
      />
    </div>
  );
};
