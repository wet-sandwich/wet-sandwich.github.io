<script lang="ts">
  import { SubHeader } from "#lib";
  import type { TimeEntry } from "#lib/Database.ts";
  import { BarChart } from "layerchart";
  import { format } from "date-fns";
  import { createDataSeries } from "#lib/utils/reports.ts";

  interface Props {
    entries: TimeEntry[];
    start: number;
    end: number;
  }

  let { entries, start, end }: Props = $props();

  let data = $derived(createDataSeries(entries, start, end));
</script>

<div class="md:w-full md:max-w-lg md:mx-auto h-[300px] flex flex-col">
  <SubHeader>Daily Totals</SubHeader>
  <div class="min-h-0 flex-1 px-4 py-4 md:px-0">
    <BarChart
      {data}
      x="date"
      y="value"
      series={[
        {
          key: "value",
          color: "var(--color-blue-900)",
        },
      ]}
      props={{
        xAxis: {
          format: (d: Date) => format(d, "M/d"),
          tickOcclusion: true,
        },
      }}
    />
  </div>
</div>
