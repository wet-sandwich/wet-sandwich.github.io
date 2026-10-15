<script lang="ts">
  import Play from "./icons/Play.svelte";
  import Stop from "./icons/Stop.svelte";

  interface Props {
    id: string;
    task: string;
    project: string;
    start: number;
    end?: number;
    duration?: number;
  }

  let { id, task, project, start, duration }: Props = $props();
  let elapsed = $derived(Math.round(Date.now() / 1000) - start);

  $effect(() => {
    if (duration) return;
    const id = setInterval(() => {
      elapsed += 1;
    }, 1000);

    return () => {
      clearInterval(id);
    };
  });

  function formatISOduration(seconds: number) {
    const totalMinutes = Math.round(seconds / 60);
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;

    const h = hours > 0 ? `${hours}H` : "";
    const m = minutes > 0 || hours === 0 ? `${minutes}M` : "";

    return `PT${h}${m}`;
  }

  function formatReadable(seconds: number) {
    const totalMinutes = Math.round(seconds / 60);
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;

    const m = minutes < 10 ? `0${minutes}` : `${minutes}`;

    return `${hours}:${m}`;
  }

  function startTimer() {
    console.log(`placeholder for startTimer: copy entry ${id}`);
  }

  function stopTimer() {
    console.log(`placeholder for stopTimer: stop entry ${id}`);
  }
</script>

<article
  class="flex flex-col px-4 py-2 m-2 bg-white rounded-sm shadow-md gap-2 md:max-w-lg md:mx-auto"
>
  <header class="flex items-center justify-between">
    <h2 class="text-lg font-semibold text-slate-800">{task}</h2>
    <time
      datetime={formatISOduration(duration ?? elapsed)}
      class="font-semibold text-slate-800"
    >
      {formatReadable(duration ?? elapsed)}
    </time>
  </header>
  <footer class="flex items-center justify-between">
    <h3 class="text-slate-600">{project}</h3>
    {#if duration}
      <button
        type="button"
        aria-label="start timer"
        onclick={startTimer}
        class="rounded-full test-slate-600 cursor-pointer transition hover:bg-slate-200 hover:text-slate-900
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
