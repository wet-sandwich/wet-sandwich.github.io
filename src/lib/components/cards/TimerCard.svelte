<script lang="ts">
  import { InfoModal, TimeEntryForm } from "#lib";
  import Play from "#lib/icons/Play.svelte";
  import Stop from "#lib/icons/Stop.svelte";
  import { formatISOduration, formatReadable } from "#lib/utils";

  let isModalOpen = $state(false);

  interface Props {
    id: string;
    task: string;
    project: string;
    start: number;
    end?: number;
  }

  let { id, task, project, start, end }: Props = $props();
  let duration = $derived(end ? end - start : 0)
  let elapsed = $derived(Math.round(Date.now()) - start);

  $effect(() => {
    if (end) return;
    const id = setInterval(() => {
      elapsed += 1000;
    }, 1000);

    return () => {
      clearInterval(id);
    };
  });

  function startTimer() {
    console.log(`placeholder for startTimer: copy entry ${id}`);
  }

  function stopTimer() {
    console.log(`placeholder for stopTimer: stop entry ${id}`);
  }
</script>

<article
  class="flex flex-col px-4 py-3 m-2 bg-white rounded-sm shadow-md gap-2 md:max-w-lg md:mx-auto"
>
  <header class="flex items-center justify-between">
    <h2 class="text-base font-semibold text-slate-800 w-full">
      <button
        onclick={() => (isModalOpen = true)}
        class="text-left cursor-pointer w-full"
      >
        {task}
      </button>
    </h2>
    <time
      datetime={formatISOduration(duration || elapsed)}
      class="text-base font-semibold text-slate-800 text-nowrap"
    >
      {formatReadable(duration || elapsed)}
    </time>
  </header>
  <footer class="flex items-center justify-between">
    <h3 class="text-sm text-slate-600">{project}</h3>
    {#if duration}
      <button
        type="button"
        aria-label="start timer"
        onclick={startTimer}
        class="rounded-full text-slate-600 cursor-pointer transition hover:bg-slate-200 hover:text-slate-900
        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
      >
        <Play />
      </button>
    {:else}
      <button
        type="button"
        aria-label="stop timer"
        onclick={stopTimer}
        class="rounded-full text-red-600 cursor-pointer transition hover:bg-red-200 hover:text-red-900
        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500"
      >
        <Stop />
      </button>
    {/if}
  </footer>
</article>

<InfoModal bind:show={isModalOpen} title="Time Entry">
  <TimeEntryForm
    {id}
    {task}
    {project}
    {start}
    {end}
  />
</InfoModal>
