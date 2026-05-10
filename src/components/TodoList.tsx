"use client";

import { useState } from "react";
import { useTodos } from "@/hooks/useTodos";
import { TodoInput } from "@/components/TodoInput";
import { TodoItem } from "@/components/TodoItem";
import { FilterBar } from "@/components/FilterBar";
import { StatsPanel } from "@/components/StatsPanel";
import { Button } from "@/components/ui/button";

export function TodoList() {
  const [showStats, setShowStats] = useState(false);
  const {
    todos,
    allTodos,
    filter,
    setFilter,
    addTodo,
    toggleTodo,
    deleteTodo,
    editTodo,
    updateMemo,
    clearCompleted,
    activeCount,
    completedCount,
    total,
  } = useTodos();

  return (
    <div className="mx-auto w-full max-w-2xl space-y-4">
      <div className="flex justify-end">
        <Button
          size="sm"
          variant={showStats ? "default" : "outline"}
          onClick={() => setShowStats((v) => !v)}
        >
          📊 分析
        </Button>
      </div>

      {showStats && (
        <div className="rounded-xl border border-border bg-card p-4 shadow-sm">
          <h2 className="mb-4 text-sm font-semibold text-muted-foreground uppercase tracking-wide">
            タスク分析
          </h2>
          <StatsPanel todos={allTodos} />
        </div>
      )}

      <TodoInput onAdd={(text, priority, dueDate) => addTodo(text, priority, dueDate)} />

      {total > 0 && (
        <FilterBar
          current={filter}
          onChange={setFilter}
          activeCount={activeCount}
          completedCount={completedCount}
          onClearCompleted={clearCompleted}
        />
      )}

      {todos.length === 0 ? (
        <div className="rounded-lg border border-dashed border-border py-16 text-center text-muted-foreground">
          {total === 0 ? "タスクがありません。追加してみましょう！" : "該当するタスクがありません。"}
        </div>
      ) : (
        <ul className="space-y-2">
          {todos.map((todo) => (
            <TodoItem
              key={todo.id}
              todo={todo}
              onToggle={toggleTodo}
              onDelete={deleteTodo}
              onEdit={editTodo}
              onMemo={updateMemo}
            />
          ))}
        </ul>
      )}
    </div>
  );
}
