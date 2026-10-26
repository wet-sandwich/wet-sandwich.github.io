<script lang="ts">
  import IntervalSelect from "./IntervalSelect.svelte";
  import { IconButton, PageHeader, SectionHeader } from "#lib";
  import Gear from "#lib/icons/Gear.svelte";
  import db from "#lib/Database.ts";
  import type { TimeEntry } from "#lib/Database.ts";
  import { formatHoursMinutes } from "#lib/utils/time.ts";

  let entries: TimeEntry[] = $state([]);
  let start: number | null = $state(null);
  let end: number | null = $state(null);
  let total = $derived.by(() => {
    return entries.reduce((acc, val) => acc + val.end - val.start, 0);
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
    onclick={() => console.log("report settings")}
  />
</PageHeader>

<SectionHeader>Intervals</SectionHeader>
<IntervalSelect bind:start bind:end />

<SectionHeader>Tracked Hours</SectionHeader>
<p class="text-center text-5xl font-bold mt-4">{formatHoursMinutes(total)}</p>
