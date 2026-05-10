"use client";

import { Button } from "@/components/ui/button";
import type { Filter } from "@/types/todo";

const FILTERS: { value: Filter; label: string }[] = [
  { value: "all", label: "すべて" },
  { value: "active", label: "未完了" },
  { value: "completed", label: "完了済み" },
];

interface Props {
  current: Filter;
  onChange: (f: Filter) => void;
  activeCount: number;
  completedCount: number;
  onClearCompleted: () => void;
}

export function FilterBar({
  current,
  onChange,
  activeCount,
  completedCount,
  onClearCompleted,
}: Props) {
  return (
    <div className="flex items-center justify-between gap-2 text-sm">
      <span className="text-muted-foreground whitespace-nowrap">
        残り <strong>{activeCount}</strong> 件
      </span>
      <div className="flex gap-1">
        {FILTERS.map((f) => (
          <Button
            key={f.value}
            size="sm"
            variant={current === f.value ? "default" : "ghost"}
            onClick={() => onChange(f.value)}
          >
            {f.label}
          </Button>
        ))}
      </div>
      {completedCount > 0 && (
        <Button
          size="sm"
          variant="ghost"
          onClick={onClearCompleted}
          className="text-muted-foreground hover:text-destructive whitespace-nowrap"
        >
          完了済みを削除
        </Button>
      )}
    </div>
  );
}
