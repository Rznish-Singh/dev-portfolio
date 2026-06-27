"use client";

import { use } from "react";
import { cn } from "@/lib/utils";
import { Spinner } from "@/components/ui/spinner";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import type { Activity } from "@/lib/get-cached-contributions";

const BLOCK_SIZE = 11;
const BLOCK_MARGIN = 3;
const MONTH_LABELS = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

type Week = (Activity | null)[];

function isSameDay(a: Date, b: Date) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

function buildWeeks(activities: Activity[]): {
  weeks: Week[];
  monthLabels: { weekIndex: number; label: string }[];
} {
  if (activities.length === 0) return { weeks: [], monthLabels: [] };

  const sorted = [...activities].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  const first = new Date(sorted[0].date);
  const leadingEmpty = first.getDay(); // 0 = Sunday

  const cells: (Activity | null)[] = [
    ...Array.from({ length: leadingEmpty }, () => null),
    ...sorted,
  ];
  while (cells.length % 7 !== 0) cells.push(null);

  const weeks: Week[] = [];
  for (let i = 0; i < cells.length; i += 7) {
    weeks.push(cells.slice(i, i + 7));
  }

  const monthLabels: { weekIndex: number; label: string }[] = [];
  let lastMonth = -1;
  weeks.forEach((week, weekIndex) => {
    const firstOfMonth = week.find(
      (day) => day && new Date(day.date).getDate() <= 7
    );
    if (firstOfMonth) {
      const month = new Date(firstOfMonth.date).getMonth();
      if (month !== lastMonth) {
        monthLabels.push({ weekIndex, label: MONTH_LABELS[month] });
        lastMonth = month;
      }
    }
  });

  return { weeks, monthLabels };
}

function levelClass(level: number) {
  switch (level) {
    case 0:
      return "bg-ink/[0.06]";
    case 1:
      return "bg-ink/30";
    case 2:
      return "bg-ink/50";
    case 3:
      return "bg-ink/75";
    default:
      return "bg-ink";
  }
}

export function GitHubActivity({
  contributions,
  githubProfileUrl,
  className,
}: {
  contributions: Promise<Activity[]>;
  githubProfileUrl: string;
  className?: string;
}) {
  const data = use(contributions);
  const { weeks, monthLabels } = buildWeeks(data);
  const total = data.reduce((sum, day) => sum + day.count, 0);
  const today = new Date();

  if (data.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-line px-4 py-8 text-center font-mono text-xs text-muted">
        activity log unavailable — check GITHUB_CONTRIBUTIONS_API_URL or your
        connection
      </div>
    );
  }

  return (
    <div className={cn("w-full", className)}>
      <div className="no-scrollbar overflow-x-auto pb-1">
        <div
          className="relative"
          style={{ width: weeks.length * (BLOCK_SIZE + BLOCK_MARGIN) }}
        >
          {/* Month labels */}
          <div className="relative h-4 font-mono text-[0.65rem] text-muted">
            {monthLabels.map(({ weekIndex, label }) => (
              <span
                key={`${label}-${weekIndex}`}
                className="absolute"
                style={{ left: weekIndex * (BLOCK_SIZE + BLOCK_MARGIN) }}
              >
                {label}
              </span>
            ))}
          </div>

          {/* Grid */}
          <div className="flex gap-[3px]">
            {weeks.map((week, weekIndex) => (
              <div key={weekIndex} className="flex flex-col gap-[3px]">
                {week.map((day, dayIndex) => {
                  if (!day) {
                    return (
                      <div
                        key={dayIndex}
                        style={{ width: BLOCK_SIZE, height: BLOCK_SIZE }}
                      />
                    );
                  }

                  const date = new Date(day.date);
                  const isToday = isSameDay(date, today);

                  return (
                    <Tooltip key={day.date}>
                      <TooltipTrigger asChild>
                        <div
                          style={{ width: BLOCK_SIZE, height: BLOCK_SIZE }}
                          className="relative"
                        >
                          <div
                            className={cn(
                              "h-full w-full cursor-default rounded-[2px] transition-[background-color] duration-150",
                              levelClass(day.level)
                            )}
                          />
                          {isToday && (
                            <span
                              aria-hidden
                              className="animate-blink pointer-events-none absolute -inset-[2px] rounded-[3px] outline outline-1 outline-signal"
                            />
                          )}
                        </div>
                      </TooltipTrigger>
                      <TooltipContent>
                        {day.count} contribution{day.count === 1 ? "" : "s"} on{" "}
                        {date.toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </TooltipContent>
                    </Tooltip>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-3 flex flex-wrap items-center justify-between gap-2 font-mono text-xs text-muted">
        <p>
          {total.toLocaleString("en")} contributions in the last year on{" "}
          <a
            className="link-underline text-ink"
            href={githubProfileUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            GitHub
          </a>
          .
        </p>

        <div className="flex items-center gap-1">
          <span>Less</span>
          {[0, 1, 2, 3, 4].map((level) => (
            <div
              key={level}
              style={{ width: BLOCK_SIZE, height: BLOCK_SIZE }}
              className={cn("rounded-[2px]", levelClass(level))}
            />
          ))}
          <span>More</span>
        </div>
      </div>
    </div>
  );
}

export function GitHubActivityFallback() {
  return (
    <div className="flex h-40 w-full items-center justify-center">
      <Spinner className="text-muted" />
    </div>
  );
}
