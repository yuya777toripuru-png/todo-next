import { TodoList } from "@/components/TodoList";

export default function Home() {
  return (
    <main className="min-h-screen bg-background px-4 py-12">
      <div className="mx-auto max-w-2xl space-y-8">
        <div className="text-center space-y-1">
          <h1 className="text-3xl font-bold tracking-tight">TODOリスト</h1>
          <p className="text-muted-foreground text-sm">タスクを管理しましょう</p>
        </div>
        <TodoList />
      </div>
    </main>
  );
}
