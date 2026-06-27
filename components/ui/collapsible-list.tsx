"use client";

import { useState } from "react";
import { ChevronDownIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export function CollapsibleList<T>({
  items,
  max,
  renderItem,
}: {
  items: T[];
  max: number;
  renderItem: (item: T, isFirst: boolean, isLast: boolean) => React.ReactNode;
}) {
  const [showAll, setShowAll] = useState(false);
  const visible = showAll ? items : items.slice(0, max);
  const hasMore = items.length > max;

  return (
    <div>
      <div className="flex flex-col">
        {visible.map((item, index) => (
          <div key={index}>
            {renderItem(item, index === 0, index === visible.length - 1)}
          </div>
        ))}
      </div>

      {hasMore && (
        <button
          type="button"
          onClick={() => setShowAll((v) => !v)}
          className="mt-3 flex items-center gap-1.5 font-mono text-xs text-muted transition-colors hover:text-ink"
        >
          <ChevronDownIcon
            className={cn("size-3.5 transition-transform", showAll && "rotate-180")}
          />
          {showAll ? "Show less" : `Show ${items.length - max} more`}
        </button>
      )}
    </div>
  );
}
