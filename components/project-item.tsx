import { BoxIcon, GithubIcon, InfinityIcon, LinkIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import type { Project } from "@/config/projects";
import { Tag } from "@/components/ui/tag";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import {
  CollapsibleChevronsIcon,
  CollapsibleContent,
  CollapsibleTrigger,
  CollapsibleWithContext,
} from "@/components/ui/collapsible";

export function ProjectItem({
  className,
  project,
  isFirst = false,
  isLast = false,
}: {
  className?: string;
  project: Project;
  isFirst?: boolean;
  isLast?: boolean;
}) {
  const { start, end } = project.period;
  const isOngoing = !end;
  const isSinglePeriod = end === start;
  const isExpanded = project.isExpanded ?? false;

  return (
    <CollapsibleWithContext defaultOpen={isExpanded}>
      <div className={cn(className, "group/item")}>
        <div
          className={cn(
            "flex items-center border border-line",
            isFirst && "rounded-t-xl",
            isLast && "rounded-b-xl"
          )}
        >
          <div
            className="mx-4 flex size-6 shrink-0 items-center justify-center rounded-lg border border-line bg-paper-raised text-muted"
            aria-hidden="true"
          >
            <BoxIcon className="size-4" />
          </div>

          <div className="flex-1">
            <CollapsibleTrigger className="flex w-full items-center gap-2 p-4 pr-2 text-left">
              <div className="flex-1">
                <h3 className="mb-1 font-display font-medium leading-snug text-ink">
                  {project.title}
                </h3>
                <dl className="font-mono text-xs text-muted">
                  <dt className="sr-only">Period</dt>
                  <dd className="flex items-center gap-1">
                    <span>{start}</span>
                    {!isSinglePeriod && (
                      <>
                        <span>—</span>
                        {isOngoing ? (
                          <>
                            <InfinityIcon className="size-3.5 translate-y-px" aria-hidden />
                            <span className="sr-only">Present</span>
                          </>
                        ) : (
                          <span>{end}</span>
                        )}
                      </>
                    )}
                  </dd>
                </dl>
              </div>

              {project.github && (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <a
                      className="relative flex size-7 shrink-0 items-center justify-center text-muted hover:text-ink"
                      href={project.github}
                      target="_blank"
                      rel="noreferrer noopener"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <GithubIcon className="pointer-events-none size-4" />
                    </a>
                  </TooltipTrigger>
                  <TooltipContent>View source</TooltipContent>
                </Tooltip>
              )}

              <Tooltip>
                <TooltipTrigger asChild>
                  <a
                    className="relative flex size-7 shrink-0 items-center justify-center text-muted hover:text-ink"
                    href={project.link}
                    target="_blank"
                    rel="noreferrer noopener"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <LinkIcon className="pointer-events-none size-4" />
                  </a>
                </TooltipTrigger>
                <TooltipContent>Open project</TooltipContent>
              </Tooltip>

              <div className="shrink-0 text-muted" aria-hidden>
                <CollapsibleChevronsIcon />
              </div>
            </CollapsibleTrigger>
          </div>
        </div>

        <CollapsibleContent
          className={cn(
            "border-x border-dashed border-line",
            isLast && "group-data-[state=open]/collapsible:border-b"
          )}
        >
          <div className="space-y-4 p-4">
            {project.description && (
              <p className="font-mono text-sm leading-6 text-ink/80">
                {project.description}
              </p>
            )}

            {project.skills.length > 0 && (
              <ul className="flex flex-wrap gap-1.5">
                {project.skills.map((skill) => (
                  <li key={skill} className="flex">
                    <Tag>{skill}</Tag>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </CollapsibleContent>
      </div>
    </CollapsibleWithContext>
  );
}
