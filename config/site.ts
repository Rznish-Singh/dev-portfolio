import {
  BookOpenIcon,
  FolderGit2Icon,
  GithubIcon,
  HomeIcon,
  LinkedinIcon,
  MailIcon,
  type LucideIcon,
} from "lucide-react";

export const SCROLL_AREA_ID = "scroll-area";
export const MOBILE_SCROLL_THRESHOLD = 80;

export type NavLink = {
  href: string;
  label: string;
  icon: LucideIcon;
};

export const DockConfig: {
  navbar: NavLink[];
  social: Record<string, NavLink>;
} = {
  navbar: [
    { href: "/", label: "Home", icon: HomeIcon },
    { href: "/writing", label: "Writing", icon: BookOpenIcon },
    { href: "/#projects", label: "Projects", icon: FolderGit2Icon },
  ],
  social: {
    github: { href: "https://github.com/Rznish-singh", label: "GitHub", icon: GithubIcon },
    linkedin: {
      href: "https://linkedin.com/in/rznish",
      label: "LinkedIn",
      icon: LinkedinIcon,
    },
    email: { href: "rajnishsingh2k28@gmail.com", label: "Email", icon: MailIcon },
  },
};
