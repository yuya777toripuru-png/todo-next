"use client";

import { useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { TodoMemo } from "@/components/TodoMemo";
import type { Todo } from "@/types/todo";

const PRIORITY_COLORS = {
  low: "secondary",
  medium: "outline",
  high: "destructive",
} as const;

const PRIORITY_LABELS = {
  low: "低",
  medium: "中",
  high: "高",
} as const;

function getDueDateStatus(dueDate: string, completed: boolean) {
  if (completed) return null;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const due = new Date(dueDate);
  const diffDays = Math.floor((due.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  if (diffDays < 0) return { label: `${Math.abs(diffDays)}日超過`, variant: "destructive" as const };
  if (diffDays === 0) return { label: "今日が締め切り", variant: "destructive" as const };
  if (diffDays <= 3) return { label: `あと${diffDays}日`, variant: "outline" as const };
  return { label: `あと${diffDays}日`, variant: "secondary" as const };
}

function formatDate(dateStr: string) {
  const [y, m, d] = dateStr.split("-");
  return `${y}/${m}/${d}`;
}

interface Props {
  todo: Todo;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit: (id: string, text: string, dueDate?: string | null) => void;
  onMemo: (id: string, memo: string) => void;
}

export function TodoItem({ todo, onToggle, onDelete, onEdit, onMemo }: Props) {
  const [editing, setEditing] = useState(false);
  const [editText, setEditText] = useState(todo.text);
  const [editDueDate, setEditDueDate] = useState(todo.dueDate ?? "");

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onEdit(todo.id, editText, editDueDate || null);
    setEditing(false);
  };

  const handleEditKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      setEditText(todo.text);
      setEditDueDate(todo.dueDate ?? "");
      setEditing(false);
    }
  };

  const dueDateStatus = todo.dueDate ? getDueDateStatus(todo.dueDate, todo.completed) : null;

  return (
    <li className="flex items-start gap-3 rounded-lg border border-border bg-card px-4 py-3 shadow-sm transition-colors hover:bg-accent/30">
      <Checkbox
        checked={todo.completed}
        onCheckedChange={() => onToggle(todo.id)}
        id={todo.id}
        className="mt-0.5"
      />
      <div className="flex flex-1 flex-col gap-1 min-w-0">
        {editing ? (
          <form onSubmit={handleEditSubmit} className="space-y-2">
            <Input
              value={editText}
              onChange={(e) => setEditText(e.target.value)}
              onKeyDown={handleEditKeyDown}
              autoFocus
            />
            <div className="flex items-center gap-2">
              <label className="text-sm text-muted-foreground whitespace-nowrap">締め切り:</label>
              <Input
                type="date"
                value={editDueDate}
                onChange={(e) => setEditDueDate(e.target.value)}
                className="flex-1"
              />
              {editDueDate && (
                <Button
                  type="button"
                  size="sm"
                  variant="ghost"
                  onClick={() => setEditDueDate("")}
                  className="text-muted-foreground"
                >
                  クリア
                </Button>
              )}
            </div>
            <div className="flex gap-2">
              <Button type="submit" size="sm">保存</Button>
              <Button
                type="button"
                size="sm"
                variant="outline"
                onClick={() => {
                  setEditText(todo.text);
                  setEditDueDate(todo.dueDate ?? "");
                  setEditing(false);
                }}
              >
                キャンセル
              </Button>
            </div>
          </form>
        ) : (
          <>
            <div className="flex items-center gap-2 flex-wrap">
              <label
                htmlFor={todo.id}
                className={`cursor-pointer text-sm ${
                  todo.completed ? "text-muted-foreground line-through" : ""
                }`}
              >
                {todo.text}
              </label>
              <Badge variant={PRIORITY_COLORS[todo.priority]} className="text-xs">
                {PRIORITY_LABELS[todo.priority]}
              </Badge>
            </div>
            {todo.dueDate && (
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground">
                  締め切り: {formatDate(todo.dueDate)}
                </span>
                {dueDateStatus && (
                  <Badge variant={dueDateStatus.variant} className="text-xs">
                    {dueDateStatus.label}
                  </Badge>
                )}
              </div>
            )}
            <TodoMemo memo={todo.memo} onSave={(memo) => onMemo(todo.id, memo)} />
          </>
        )}
      </div>
      {!editing && (
        <div className="flex gap-1 shrink-0">
          <Button
            size="sm"
            variant="ghost"
            onClick={() => setEditing(true)}
            className="h-7 w-7 p-0 text-muted-foreground hover:text-foreground"
            aria-label="編集"
          >
            ✏️
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => onDelete(todo.id)}
            className="h-7 w-7 p-0 text-muted-foreground hover:text-destructive"
            aria-label="削除"
          >
            🗑️
          </Button>
        </div>
      )}
    </li>
  );
}
