<script>
  import Play from '../lib/icons/Play.svelte';

  let { task, project, time } = $props();

  function formatISOduration(seconds) {
    const totalMinutes = Math.round(seconds / 60);
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;

    const h = hours > 0 ? `${hours}H` : '';
    const m = minutes > 0 || hours === 0 ? `${minutes}M` : '';

    return `PT${h}${m}`;
  }

  function formatReadable(seconds) {
    const totalMinutes = Math.round(seconds / 60);
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;

    const m = minutes < 10 ? `0${minutes}` : `${minutes}`;

    return `${hours}:${m}`
  }
</script>

<article class="flex flex-col px-4 py-2 m-2 bg-white rounded-sm shadow-md gap-2 md:max-w-lg md:mx-auto">
  <header class="flex items-center justify-between">
    <h2 class="text-lg font-semibold text-slate-800">{task}</h2>
    <time datetime={formatISOduration(time)} class="font-semibold text-slate-800">
      {formatReadable(time)}
    </time>
  </header>
  <footer class="flex items-center justify-between">
    <h3 class="text-slate-600">{project}</h3>
    <button
      type="button"
      aria-label="start timer"
      onclick={() => console.log(task)}
      class="rounded-full text-slate-600
        cursor-pointer transition hover:bg-slate-200 hover:text-slate-900
        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
    >
      <Play />
    </button>
  </footer>
</article>
