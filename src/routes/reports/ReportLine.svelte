<script lang="ts">
  import { formatHoursMinutes } from "#lib/utils";
  import type { Breakdown } from "#lib/utils";

  interface Props {
    project: string;
    breakdown: Breakdown;
  }

  let { project, breakdown }: Props = $props();
  let isOpen = $state(false);
</script>

<div class="border-b border-slate-400">
  <button
    type="button"
    class="flex w-full items-center py-1 text-left font-medium tex:slate-800 transition-colors hover:text-blue-700 focus:outline-none"
    onclick={() => (isOpen = !isOpen)}
  >
    <svg
      xmlns="http://w3.org"
      fill="none"
      viewBox="0 0 24 24"
      stroke-width="2"
      stroke="currentColor"
      class="mr-3 h-4 w-4 transform text-slate-500 transition-transform duration-200 {isOpen
        ? 'rotate-90'
        : ''}"
    >
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        d="M8.25 4.5l7.5 7.5-7.5 7.5"
      />
    </svg>
    <div class="flex items-baseline justify-between w-full text-lg">
      <span>{project}</span>
      <span>{formatHoursMinutes(breakdown.total)}</span>
    </div>
  </button>
  <div
    class="grid transition-[grid-template-rows] duration-200 ease-in-out {isOpen
      ? 'grid-rows-[1fr]'
      : 'grid-rows-[0fr]'}"
  >
    <div class="overflow-hidden">
      {#each Object.entries(breakdown.tasks) as [task, total] (task)}
        <div class="flex items-baseline justify-between w-full my-2 pl-7 leading-relaxed text-slate-600">
          <span>{task}</span>
          <span class="flex-1 border-b border-solid border-gray-300" aria-hidden="true"></span>
          <span>{formatHoursMinutes(total)}</span>
        </div>
      {/each}
    </div>
  </div>
</div>
