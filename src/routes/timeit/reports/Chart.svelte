<script lang="ts">
  import { SubHeader } from "#lib";
  import type { TimeEntry } from "#lib/timeit/Database.ts";
  import { BarChart } from "layerchart";
  import { format } from "date-fns";
  import { interpolateBlues } from "d3-scale-chromatic";
  import { createDataSeries, createProjectSeries } from "#lib/timeit/reports.ts";

  interface Props {
    entries: TimeEntry[];
    start: number;
    end: number;
    chartStyle: "mixed" | "separate";
  }

  let { entries, start, end, chartStyle }: Props = $props();

  const LIGHTEST = 0.3;
  const DARKEST = 0.95;

  // project with most hours gets the darkest blue
  function projectColor(index: number, count: number): string {
    if (count === 1) return interpolateBlues(DARKEST);
    return interpolateBlues(
      DARKEST - (index / (count - 1)) * (DARKEST - LIGHTEST),
    );
  }

  let chart = $derived.by(() => {
    if (chartStyle === "mixed") {
      return {
        data: createDataSeries(entries, start, end),
        series: [
          { key: "value", label: "Hours", color: "var(--color-blue-900)" },
        ],
      };
    }
    const { data, projects } = createProjectSeries(entries, start, end);
    return {
      data,
      series: projects.map(({ key, name }, i) => ({
        key,
        label: name,
        color: projectColor(i, projects.length),
      })),
    };
  });
</script>

<div class="md:w-full md:max-w-lg md:mx-auto h-[300px] flex flex-col">
  <SubHeader>Daily Totals</SubHeader>
  <div class="min-h-0 flex-1 px-4 py-4 md:px-0">
    <BarChart
      data={chart.data}
      x="date"
      series={chart.series}
      seriesLayout={chartStyle === "separate" ? "stack" : undefined}
      legend={chartStyle === "separate"}
      props={{
        xAxis: {
          format: (d: Date) => format(d, "M/d"),
          tickOcclusion: true,
        },
      }}
    />
  </div>
</div>
