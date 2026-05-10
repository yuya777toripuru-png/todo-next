"use client";

import type { Todo } from "@/types/todo";

interface Props {
  todos: Todo[];
}

function today() {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d;
}

function parseDue(dateStr: string) {
  const [y, m, d] = dateStr.split("-").map(Number);
  return new Date(y, m - 1, d);
}

function ProgressBar({ value, max, color }: { value: number; max: number; color: string }) {
  const pct = max === 0 ? 0 : Math.round((value / max) * 100);
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-2 rounded-full bg-muted overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-500 ${color}`}
          style={{ width: `${pct}%` }}
        />
      </div>
      <span className="text-xs text-muted-foreground w-8 text-right">{pct}%</span>
    </div>
  );
}

function Stat({ label, value, sub }: { label: string; value: number | string; sub?: string }) {
  return (
    <div className="rounded-lg border border-border bg-card p-3 text-center">
      <div className="text-2xl font-bold">{value}</div>
      <div className="text-xs text-muted-foreground mt-0.5">{label}</div>
      {sub && <div className="text-xs text-muted-foreground/70 mt-0.5">{sub}</div>}
    </div>
  );
}

export function StatsPanel({ todos }: Props) {
  const todayDate = today();
  const total = todos.length;
  const completed = todos.filter((t) => t.completed).length;
  const active = total - completed;

  const high = todos.filter((t) => t.priority === "high" && !t.completed).length;
  const medium = todos.filter((t) => t.priority === "medium" && !t.completed).length;
  const low = todos.filter((t) => t.priority === "low" && !t.completed).length;

  const withDue = todos.filter((t) => t.dueDate);
  const overdue = withDue.filter(
    (t) => !t.completed && parseDue(t.dueDate!) < todayDate
  ).length;
  const dueToday = withDue.filter(
    (t) => !t.completed && parseDue(t.dueDate!).getTime() === todayDate.getTime()
  ).length;
  const dueSoon = withDue.filter((t) => {
    if (t.completed) return false;
    const diff = Math.floor((parseDue(t.dueDate!).getTime() - todayDate.getTime()) / 86400000);
    return diff > 0 && diff <= 3;
  }).length;

  const withMemo = todos.filter((t) => t.memo && t.memo.trim()).length;

  if (total === 0) {
    return (
      <div className="rounded-lg border border-dashed border-border py-8 text-center text-sm text-muted-foreground">
        タスクがまだ登録されていません
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {/* サマリー */}
      <div className="grid grid-cols-3 gap-2">
        <Stat label="総タスク" value={total} />
        <Stat label="未完了" value={active} />
        <Stat label="完了済み" value={completed} />
      </div>

      {/* 完了率 */}
      <div className="space-y-1">
        <div className="flex justify-between text-sm">
          <span className="font-medium">完了率</span>
          <span className="text-muted-foreground">{completed}/{total}</span>
        </div>
        <ProgressBar value={completed} max={total} color="bg-green-500" />
      </div>

      {/* 優先度別（未完了のみ） */}
      {active > 0 && (
        <div className="space-y-2">
          <p className="text-sm font-medium">優先度別（未完了）</p>
          <div className="space-y-1.5">
            <div className="flex items-center gap-2 text-sm">
              <span className="w-14 text-xs text-muted-foreground">高</span>
              <ProgressBar value={high} max={active} color="bg-red-500" />
              <span className="text-xs text-muted-foreground w-4">{high}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <span className="w-14 text-xs text-muted-foreground">中</span>
              <ProgressBar value={medium} max={active} color="bg-yellow-500" />
              <span className="text-xs text-muted-foreground w-4">{medium}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <span className="w-14 text-xs text-muted-foreground">低</span>
              <ProgressBar value={low} max={active} color="bg-blue-400" />
              <span className="text-xs text-muted-foreground w-4">{low}</span>
            </div>
          </div>
        </div>
      )}

      {/* 締め切り状況 */}
      <div className="space-y-2">
        <p className="text-sm font-medium">締め切り状況</p>
        <div className="grid grid-cols-2 gap-2">
          <div className={`rounded-md border p-2 text-center ${overdue > 0 ? "border-destructive/60 bg-destructive/5" : "border-border"}`}>
            <div className={`text-xl font-bold ${overdue > 0 ? "text-destructive" : ""}`}>{overdue}</div>
            <div className="text-xs text-muted-foreground">期限超過</div>
          </div>
          <div className={`rounded-md border p-2 text-center ${dueToday > 0 ? "border-orange-400/60 bg-orange-50 dark:bg-orange-950/20" : "border-border"}`}>
            <div className={`text-xl font-bold ${dueToday > 0 ? "text-orange-500" : ""}`}>{dueToday}</div>
            <div className="text-xs text-muted-foreground">今日締め切り</div>
          </div>
          <div className="rounded-md border border-border p-2 text-center">
            <div className="text-xl font-bold">{dueSoon}</div>
            <div className="text-xs text-muted-foreground">3日以内</div>
          </div>
          <div className="rounded-md border border-border p-2 text-center">
            <div className="text-xl font-bold">{withDue.length}</div>
            <div className="text-xs text-muted-foreground">締め切りあり</div>
          </div>
        </div>
      </div>

      {/* メモ */}
      <div className="space-y-1">
        <div className="flex justify-between text-sm">
          <span className="font-medium">メモ記入済み</span>
          <span className="text-muted-foreground">{withMemo}/{total}</span>
        </div>
        <ProgressBar value={withMemo} max={total} color="bg-purple-500" />
      </div>
    </div>
  );
}
