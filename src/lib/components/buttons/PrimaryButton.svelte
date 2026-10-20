<script lang="ts">
  import type { HTMLButtonAttributes } from "svelte/elements";

  interface Props {
    text: string;
  }

  let { onclick, text, ...rest }: Props & HTMLButtonAttributes = $props();
</script>

<button
  {onclick}
  {...rest}
  class="text-white bg-blue-500 hover:bg-blue-700 font-bold py-2 px-4 rounded shadow-md cursor-pointer"
>
  {text}
</button>
