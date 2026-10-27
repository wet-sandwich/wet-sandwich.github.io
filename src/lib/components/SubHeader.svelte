<script lang="ts">
  import type { Snippet } from "svelte";

  interface Props {
    children: Snippet;
  }

  let { children }: Props = $props();
</script>

<h2 class="font-semibold mx-4 my-2 md:w-full md:max-w-lg md:mx-auto">
  {@render children()}
</h2>
