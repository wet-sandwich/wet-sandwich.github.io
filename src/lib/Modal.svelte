<script lang="ts">
  let { show = $bindable(false), title, children } = $props();

  let dialogRef: HTMLDialogElement | null  = $state(null);

  $effect(() => {
    if (show) {
      dialogRef?.showModal();
    } else {
      dialogRef?.close();
    }
  });
</script>

<dialog
  bind:this={dialogRef}
  onclose={() => (show = false)}
  onclick={(e) => e.target === dialogRef && (show = false)}
  class="mx-0 mt-auto mb-0 h-[75dvh] max-h-none w-full max-w-none rounded-t-2xl
    sm:m-auto sm:h-auto sm:max-h-[calc(100dvh-4rem)] sm:w-[calc(100%-2rem)] sm:max-w-md sm:rounded-xl"
>
  <div class="p-4" role="document">
    <header class="flex items-center justify-between pb-2 mb-2">
      <h2>{title}</h2>
      <button
        class="bg-none border-none text-lg cursor-pointer"
        onclick={() => (show = false)}
        aria-label="close modal"
      >
        &times;
      </button>
    </header>
    <main>
      {@render children()}
    </main>
  </div>
</dialog>
