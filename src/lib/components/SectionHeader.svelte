<script lang="ts">
  import type { Snippet } from "svelte";

  interface Props {
    children: Snippet;
    actions?: Snippet;
  }

  let { children, actions }: Props = $props();
</script>

{#if actions}
  <div
    class="mx-4 mb-2 mt-4 flex items-baseline justify-between gap-4 md:mx-auto md:w-full md:max-w-lg"
  >
    <h1 class="uppercase font-semibold">
      {@render children()}
    </h1>
    {@render actions()}
  </div>
{:else}
  <h1 class="uppercase font-semibold mx-4 mb-2 mt-4 md:w-full md:max-w-lg md:mx-auto">
    {@render children()}
  </h1>
{/if}
