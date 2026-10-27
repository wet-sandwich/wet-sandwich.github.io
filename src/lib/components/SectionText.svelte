<script lang="ts">
  import type { Snippet } from "svelte";

  interface Props {
    children: Snippet;
  }

  let { children }: Props = $props();
</script>

<p class="mx-4 md:max-w-lg md:mx-auto">
  {@render children()}
</p>
