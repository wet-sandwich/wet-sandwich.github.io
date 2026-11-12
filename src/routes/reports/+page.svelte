<script lang="ts">
  import IntervalSelect from "./IntervalSelect.svelte";
  import Report from "./Report.svelte";
  import { IconButton, PageHeader, SectionHeader, InfoModal, Radio } from "#lib";
  import PersistentState from "#lib/PersistentState.svelte.ts";
  import Gear from "#lib/icons/Gear.svelte";
  import db, { type TimeEntry } from "#lib/Database.ts";
  import { formatHoursMinutes, numberOfDays } from "#lib/utils";
  import Chart from "./Chart.svelte";

  let entries: TimeEntry[] = $state([]);
  let start: number | null = $state(null);
  let end: number | null = $state(null);
  let isSettingsOpen = $state(false);

  let chartStyle = new PersistentState<"mixed" | "separate">("chartStyle", "mixed");

  let total = $derived.by(() => {
    return entries.reduce((acc, val) => acc + val.end - val.start, 0);
  });

  let numDays = $derived.by(() => {
    if (!start || !end) return 0;
    return numberOfDays(start, end);
  });

  $effect(() => {
    async function handleInterval() {
      if (!start || !end) return;
      entries = await db.getTimersBetween(start, end);
    }
    handleInterval();
  });
</script>

<PageHeader title="Reports">
  <IconButton
    label="Settings"
    icon={Gear}
    onclick={() => (isSettingsOpen = true)}
  />
</PageHeader>

<div class="min-h-0 flex-1 overflow-y-auto">
  <SectionHeader>Intervals</SectionHeader>
  <IntervalSelect bind:start bind:end />

  <SectionHeader>Tracked Hours</SectionHeader>
  <p class="text-center text-5xl font-bold mt-4 mb-6">
    {formatHoursMinutes(total)}
  </p>

  <Report {entries} />

  {#if start && end && numDays > 1 && total > 0}
    <Chart {entries} {start} {end} />
  {/if}
</div>

<InfoModal bind:show={isSettingsOpen} title="Report Settings">
  <form class="flex flex-col gap-2">
    <Radio
      state={chartStyle}
      name="chartstyle"
      legend="Chart style:"
      options={[
        { name: "Separate", value: "separate" },
        { name: "Mixed", value: "mixed" },
      ]}
    />
  </form>
</InfoModal>
