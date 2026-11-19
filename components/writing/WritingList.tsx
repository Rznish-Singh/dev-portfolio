import Link from "next/link";
import { groupByYear, formatShort } from "@/lib/writing";
import { cn } from "@/lib/utils";
import { NewBadge } from "@/components/ui/NewBadge";

export function WritingList({
  limit,
  bordered = true,
  className,
}: {
  limit?: number;
  bordered?: boolean;
  className?: string;
}) {
  const groups = groupByYear(limit);

  return (
    <div
      className={cn(
        bordered && "border-b border-ink/10",
        // Hovering a row dims every other row and year (mouse devices only)
        "[@media(hover:hover)]:[&:hover_[data-row]:not(:hover)]:opacity-35",
        "[@media(hover:hover)]:[&:hover_[data-year]:not(:hover)_[data-label]]:opacity-35",
        className,
      )}
    >
      {groups.map(({ year, posts }) => (
        <div
          key={year}
          data-year
          className={cn(
            "grid grid-cols-[3.5rem_1fr] sm:grid-cols-[8rem_1fr]",
            bordered && "border-t  border-ink/10",
          )}
        >
          <span
            data-label
            className={cn(
              "text-muted transition-opacity duration-200",
              bordered ? "py-3" : "py-2",
            )}
          >
            {year}
          </span>

          <ul className="min-w-0">
            {posts.map((post) => (
              <li
                key={post.slug}
                className={bordered ? "border-b border-ink/10 last:border-b-0" : ""}
              >
                <Link
                  href={`/writing/${post.slug}`}
                  data-row
                  className={cn(
                    "group flex items-baseline justify-between gap-4 transition-opacity duration-200",
                    bordered ? "py-3" : "py-2",
                  )}
                >
                  {/* the badge sits inside the title span so it stays attached to the title */}
                  <span className="min-w-0 text-ink">
                    {post.title}
                    {post.new && <NewBadge force />}
                  </span>
                  <span className="shrink-0 tabular-nums text-muted">
                    {formatShort(post.date)}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}