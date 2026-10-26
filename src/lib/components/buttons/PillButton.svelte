<script lang="ts">
  import type { HTMLButtonAttributes } from "svelte/elements";

  interface Props {
    text: string;
    selected: boolean;
  }

  let { onclick, text, selected, ...rest }: Props & HTMLButtonAttributes = $props();

  let baseClass =
    "font-bold py-2 px-4 rounded-full shadow-md cursor-pointer whitespace-nowrap";
  let stateClass = $derived(
    selected
      ? "text-white bg-blue-500 hover:bg-blue-700"
      : "text-blue bg-gray-200 hover:bg-blue-500 border border-gray-400",
  );
</script>

<button {onclick} {...rest} class={`${baseClass} ${stateClass}`}>
  {text}
</button>
