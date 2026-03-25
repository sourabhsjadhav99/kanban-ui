import type { BoardColumn } from "../types/task";

export const boardColumns: BoardColumn[] = [
  { id: "todo", title: "To Do", badgeClass: "bg-slate-200 text-slate-700" },
  { id: "in-progress", title: "In Progress", badgeClass: "bg-amber-200 text-amber-800" },
  { id: "done", title: "Done", badgeClass: "bg-emerald-200 text-emerald-800" },
];
