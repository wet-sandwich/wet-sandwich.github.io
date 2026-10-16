<script lang="ts">
  import InfoLine from "./InfoLine.svelte";
  import { formatTimestamp, formatReadable } from "#lib/utils";

  interface Props {
    id: string;
    task: string;
    project: string;
    start: number;
    end?: number;
    duration?: number;
  }

  let { task, project, start, end, duration }: Props = $props();
</script>

<article class="flex flex-col gap-2 px-1">
  <InfoLine name="Task" value={task} />
  <InfoLine name="Project" value={project} />
  <InfoLine name="Start" value={formatTimestamp(start)} />
  {#if end}<InfoLine name="End" value={formatTimestamp(end)} />{/if}
  {#if duration}<InfoLine name="Duration" value={formatReadable(duration)} />{/if}
</article>
