export type TaskStatus = "todo" | "in-progress" | "done";

export interface Task {
  _id: string;
  title: string;
  description: string;
  status: TaskStatus;
}

export interface BoardColumn {
  id: TaskStatus;
  title: string;
  badgeClass: string;
}
