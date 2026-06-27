import { Suspense } from "react";
import { GitHubActivity, GitHubActivityFallback } from "@/components/github-activity";
import { getCachedContributions } from "@/lib/get-cached-contributions";
import { USER } from "@/config/user";

export function GitHubActivitySection() {
  const contributions = getCachedContributions(USER.github.username);

  return (
    <Suspense fallback={<GitHubActivityFallback />}>
      <GitHubActivity
        contributions={contributions}
        githubProfileUrl={USER.github.profileUrl}
      />
    </Suspense>
  );
}
