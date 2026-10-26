import type { TimeEntry } from "#lib/Database.ts";

type Breakdown = Record<string, number>;

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
