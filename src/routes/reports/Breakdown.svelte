<script lang="ts">
  import { projectBreakdown } from "#lib/utils/reports.ts";
  import type { TimeEntry } from "#lib/Database.ts";
  import InfoLine from "#lib/components/forms/InfoLine.svelte";
  import { formatHoursMinutes } from "#lib/utils/time.ts";
  import SubHeader from "#lib/components/SubHeader.svelte";

  interface Props {
    entries: TimeEntry[];
  }

  let { entries }: Props = $props();
  let projectTotals = $derived(projectBreakdown(entries));
</script>

{#if entries.length}
  <div class="md:w-full md:max-w-lg md:mx-auto">
    <SubHeader>Project Totals</SubHeader>
    <article class="flex flex-col gap-2 mx-4 md:mx-auto">
      {#each Object.entries(projectTotals) as [name, total] (name)}
        <InfoLine {name} value={formatHoursMinutes(total)} />
      {/each}
    </article>
  </div>
{/if}
