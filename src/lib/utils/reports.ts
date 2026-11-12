import type { TimeEntry } from "#lib/Database.ts";
import {
  isSameYear,
  isSameDay,
  isToday,
  isYesterday,
  format,
  startOfDay,
  differenceInCalendarDays,
  eachDayOfInterval,
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

export function createDataSeries(
  entries: TimeEntry[],
  start: number,
  end: number,
): { date: Date; value: number }[] {
  const dailyTotals = new Map<number, number>();
  for (const entry of entries) {
    const day = startOfDay(entry.start).getTime();
    const hours = (entry.end - entry.start) / 1000 / 3600;
    dailyTotals.set(day, (dailyTotals.get(day) ?? 0) + hours);
  }
  return eachDayOfInterval({ start, end }).map((date) => ({
    date,
    value: dailyTotals.get(date.getTime()) ?? 0,
  }));
}

export type ProjectSeriesRow = { date: Date } & Record<string, number | Date>;

export function createProjectSeries(
  entries: TimeEntry[],
  start: number,
  end: number,
): { data: ProjectSeriesRow[]; projects: { key: string; name: string }[] } {
  const totals = new Map<string, number>();
  const daily = new Map<number, Map<string, number>>();
  for (const entry of entries) {
    const name = entry.project.trim();
    const day = startOfDay(entry.start).getTime();
    const hours = (entry.end - entry.start) / 1000 / 3600;
    totals.set(name, (totals.get(name) ?? 0) + hours);
    const byProject = daily.get(day) ?? new Map<string, number>();
    byProject.set(name, (byProject.get(name) ?? 0) + hours);
    daily.set(day, byProject);
  }

  // use a consistent key format to avoid having unusual characters in the project
  // name break chart
  const projects = [...totals.entries()]
    .sort((a, b) => b[1] - a[1])
    .map(([name], i) => ({ key: `p${i}`, name }));

  const data = eachDayOfInterval({ start, end }).map((date) => {
    const byProject = daily.get(date.getTime());
    const row: ProjectSeriesRow = { date };
    for (const { key, name } of projects) {
      row[key] = byProject?.get(name) ?? 0;
    }
    return row;
  });

  return { data, projects };
}

export function numberOfDays(start: number, end: number): number {
  return differenceInCalendarDays(end, start) + 1;
}
