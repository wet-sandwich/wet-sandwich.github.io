<script lang="ts">
  import { BarChart } from "layerchart";
  import { interpolateBlues } from "d3-scale-chromatic";
  import type { YearRow } from "#lib/alpha";

  interface Props {
    rows: YearRow[];
  }

  let { rows }: Props = $props();

  // Short axis labels like "$12K" / "$1.2M".
  const compactMoney = new Intl.NumberFormat(undefined, {
    style: "currency",
    currency: "USD",
    notation: "compact",
    maximumFractionDigits: 1,
  });
</script>

<div class="h-[320px] px-4 py-4 md:px-0">
  <BarChart
    data={rows}
    x="year"
    series={[
      {
        key: "contributions",
        label: "Contributed",
        color: interpolateBlues(0.9),
      },
      {
        key: "interest",
        label: "Interest",
        color: interpolateBlues(0.5),
      },
    ]}
    seriesLayout="stack"
    legend
    props={{
      xAxis: { tickOcclusion: true },
      yAxis: { format: (v: number) => compactMoney.format(v) },
    }}
  />
</div>
