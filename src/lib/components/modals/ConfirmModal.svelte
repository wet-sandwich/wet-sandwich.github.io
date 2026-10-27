<script lang="ts">
  import { DangerButton, SecondaryButton } from "#lib";

  interface Props {
    show: boolean;
    text: string;
    buttonText: string;
    callback: () => void;
  }

  let { show = $bindable(false), text, buttonText, callback }: Props = $props();

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

  function handleConfirm() {
    callback();
    show = false;
  }
</script>

<dialog
  bind:this={dialogRef}
  onclose={() => (show = false)}
  onclick={onDialogClick}
  class="m-auto w-full max-w-sm rounded-2xl backdrop:bg-black/70"
>
  <div class="p-4" role="document">
    <main>
      <p>{text}</p>
      <div class="flex justify-end mt-4 gap-4">
        <SecondaryButton onclick={() => (show = false)} text="Cancel" />
        <DangerButton text={buttonText} onclick={handleConfirm} />
      </div>
    </main>
  </div>
</dialog>
