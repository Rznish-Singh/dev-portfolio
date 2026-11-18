import { GitHubActivity } from "@/components/github/github-activity";
import { USER } from "@/config/user";

export function GitHubActivityliveline() {
  return <GitHubActivity githubProfileUrl={USER.github.profileUrl} />;
}