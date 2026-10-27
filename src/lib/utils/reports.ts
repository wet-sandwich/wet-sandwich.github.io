import type { TimeEntry } from "#lib/Database.ts";
import { isSameDay, isToday, isYesterday, format } from "date-fns";

type Breakdown = Record<string, number>;

export type ActivityRow =
  | { type: "header", label: string }
  | { type: "entry", entry: TimeEntry }

export function projectBreakdown(entries: TimeEntry[]): Breakdown {
  const projectTotals: Breakdown = {};
  for (const entry of entries) {
    const { project, start, end } = entry;
    if (!projectTotals[project]) {
      projectTotals[project] = end - start;
    } else {
      projectTotals[project] += end - start;
    }
  }
  return projectTotals;
}

function friendlyLabel(date: Date): string {
  if (isToday(date)) return "Today";
  if (isYesterday(date)) return "Yesterday";
  return format(date, "MMM d, y");
}

export function organizeEntries(entries: TimeEntry[]): ActivityRow[] {
  const rows: ActivityRow[] = [];
  let currentDate: Date | null = null;

  for (const entry of entries) {
    const date = new Date(entry.start);
    if (!currentDate || !isSameDay(date, currentDate)) {
      currentDate = date;
      rows.push({ type: "header", label: friendlyLabel(date) });
    }
    rows.push({ type: "entry", entry });
  }

  return rows;
}
