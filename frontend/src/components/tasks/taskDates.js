import { diffDays, relativeDayLabel } from "../dashboard/dashboardUtils";

/* Derive a display label + overdue flag from a real due date. */
export function dueMeta(dueDate, done = false) {
  if (!dueDate) return { label: "No date", overdue: false };

  const diff = diffDays(dueDate);

  if (!done && diff !== null && diff < 0) {
    return { label: "Overdue", overdue: true };
  }

  return { label: relativeDayLabel(dueDate), overdue: false };
}