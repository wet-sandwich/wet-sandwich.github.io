<script lang="ts">
  let { show = $bindable(false), title, children } = $props();

  let dialogRef: HTMLDialogElement | null = $state(null);

  $effect(() => {
    if (show) {
      dialogRef?.showModal();
    } else {
      dialogRef?.close();
    }
  });

  function onDialogClick(e: MouseEvent) {
    const r = dialogRef?.getBoundingClientRect();
    if (!r) return;
    const inside =
      e.clientX >= r.left &&
      e.clientX <= r.right &&
      e.clientY >= r.top &&
      e.clientY <= r.bottom;
    if (!inside) dialogRef?.close();
  }
</script>

<dialog
  bind:this={dialogRef}
  onclose={() => (show = false)}
  onclick={onDialogClick}
  class="mx-0 mt-auto mb-0 h-[75dvh] max-h-none w-full max-w-none rounded-t-2xl backdrop:bg-black/70
    sm:m-auto sm:h-fit sm:max-h-[calc(100dvh-4rem)] sm:w-[calc(100%-2rem)] sm:max-w-md sm:rounded-xl"
>
  <div class="p-4" role="document">
    <header class="flex items-center justify-between pb-2 mb-2">
      <h2 class="text-lg font-semibold">{title}</h2>
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

<style>
  dialog {
    overflow-y: auto;
    overscroll-behavior: contain;

    translate: 0 100%;
    transition:
      translate 300ms cubic-bezier(0.32, 0.72, 0, 1),
      overlay 300ms allow-discrete,
      display 300ms allow-discrete;
  }

  dialog[open] {
    translate: none;
  }

  @starting-style {
    dialog[open] {
      translate: 0 100%;
    }
  }

  @media (min-width: 40rem) {
    dialog {
      translate: 0 100dvh;
    }
    dialog[open] {
      translate: none;
    }
    @starting-style {
      dialog[open] {
        translate: 0 100dvh;
      }
    }
  }

  dialog::backdrop {
    opacity: 0;
    transition:
      opacity 300ms ease-out,
      overlay 300ms allow-discrete,
      display 300ms allow-discrete;
  }
  dialog[open]::backdrop {
    opacity: 1;
  }
  @starting-style {
    dialog[open]::backdrop {
      opacity: 0;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    dialog,
    dialog::backdrop {
      transition: none;
    }
  }
</style>
