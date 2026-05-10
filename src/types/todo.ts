export type Priority = "low" | "medium" | "high";

export type Filter = "all" | "active" | "completed";

export interface Todo {
  id: string;
  text: string;
  completed: boolean;
  priority: Priority;
  createdAt: number;
  dueDate?: string; // ISO date string (YYYY-MM-DD)
  memo?: string;
}
