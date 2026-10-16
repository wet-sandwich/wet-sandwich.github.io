<script lang="ts">
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
  <div class="flex justify-between">
    <span class="font-semibold">Task</span>
    {task}
  </div>
  <div class="flex justify-between">
    <span class="font-semibold">Project</span>
    {project}
  </div>
  <div class="flex justify-between">
    <span class="font-semibold">Start</span>
    {formatTimestamp(start)}
  </div>
  {#if end}
    <div class="flex justify-between">
      <span class="font-semibold">End</span>
      {formatTimestamp(end)}
    </div>
  {/if}
  {#if duration}
    <div class="flex justify-between">
      <span class="font-semibold">Duration</span>
      {formatReadable(duration)}
    </div>
  {/if}
</article>
