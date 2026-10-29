<script lang="ts">
  import type { TimeEntry } from "#lib/Database.ts";
  import ReportLine from "./ReportLine.svelte";
  import SubHeader from "#lib/components/SubHeader.svelte";
  import { generateReport } from "#lib/utils";

  interface Props {
    entries: TimeEntry[];
  }

  let { entries }: Props = $props();
  let report = $derived(generateReport(entries));
</script>

{#if entries.length}
  <div class="mb-8 md:w-full md:max-w-lg md:mx-auto">
    <SubHeader>Project Totals</SubHeader>
    <article class="flex flex-col gap-2 mx-4 md:mx-auto">
      {#each Object.entries(report) as [project, breakdown] (project)}
        <ReportLine {project} {breakdown} />
      {/each}
    </article>
  </div>
{/if}
