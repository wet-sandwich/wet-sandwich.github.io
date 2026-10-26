<script lang="ts">
  import { PillButton } from "#lib";
  import {
    getTime,
    startOfToday,
    endOfToday,
    startOfYesterday,
    endOfYesterday,
    startOfWeek,
    endOfWeek,
    startOfMonth,
    endOfMonth,
    subMonths,
    subWeeks,
  } from "date-fns";

  interface Interval {
    key: string;
    label: string;
    start(): number;
    end(): number;
  }

  interface Props {
    start: number | null;
    end: number | null;
  }

  let { start = $bindable(), end = $bindable() }: Props = $props();
  let selected: string = $state("today");

  const intervals: Record<string, Interval> = {
    today: {
      key: "today",
      label: "Today",
      start: () => getTime(startOfToday()),
      end: () => getTime(endOfToday()),
    },
    yesterday: {
      key: "yesterday",
      label: "Yesterday",
      start: () => getTime(startOfYesterday()),
      end: () => getTime(endOfYesterday()),
    },
    thisWeek: {
      key: "thisWeek",
      label: "This Week",
      start: () => getTime(startOfWeek(new Date())),
      end: () => getTime(endOfWeek(new Date())),
    },
    lastWeek: {
      key: "lastWeek",
      label: "Last Week",
      start: () => getTime(startOfWeek(subWeeks(new Date(), 1))),
      end: () => getTime(endOfWeek(subWeeks(new Date(), 1))),
    },
    thisMonth: {
      key: "thisMonth",
      label: "This Month",
      start: () => getTime(startOfMonth(new Date())),
      end: () => getTime(endOfMonth(new Date())),
    },
    lastMonth: {
      key: "lastMonth",
      label: "Last Month",
      start: () => getTime(startOfMonth(subMonths(new Date(), 1))),
      end: () => getTime(endOfMonth(subMonths(new Date(), 1))),
    },
  };

  $effect(() => {
    start = intervals[selected].start();
    end = intervals[selected].end();
  });
</script>

<div
  class="flex flex-row gap-2 m-4 pb-2 md:max-w-lg md:mx-auto overflow-x-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
>
  {#each Object.values(intervals) as interval (interval.key)}
    <PillButton
      text={interval.label}
      selected={interval.key === selected}
      onclick={() => (selected = interval.key)}
    />
  {/each}
</div>
