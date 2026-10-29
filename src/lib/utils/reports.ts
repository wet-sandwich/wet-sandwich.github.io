import type { TimeEntry } from "#lib/Database.ts";
import {
  isSameYear,
  isSameDay,
  isToday,
  isYesterday,
  format,
  startOfDay,
  formatISO,
} from "date-fns";

export type Breakdown = {
  total: number;
  tasks: {
    [k: string]: number;
  }
}

export type Report = {
  [k: string]: Breakdown;
}

export type ActivityRow =
  | { type: "header", label: string }
  | { type: "entry", entry: TimeEntry }

export function generateReport(entries: TimeEntry[]): Report {
  const report: Report = {};
  for (const entry of entries) {
    const { task, project, start, end } = entry;
    const duration = end - start;
    if (!report[project]) {
      report[project] = { total: duration, tasks: { [task]: duration } };
    } else {
      report[project].total += duration;
      if (!report[project].tasks[task]) {
        report[project].tasks[task] = duration;
      } else {
        report[project].tasks[task] += duration;
      }
    }
  }
  return report;
}

function friendlyLabel(date: Date): string {
  if (isToday(date)) return "Today";
  if (isYesterday(date)) return "Yesterday";
  if (isSameYear(Date.now(), date)) return format(date, "E MMM d");
  return format(date, "E MMM d, y");
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
