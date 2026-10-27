<script lang="ts">
  import VirtualList from "@humanspeak/svelte-virtual-list";
  import { TimerCard } from "#lib";
  import type { TimeEntry } from "#lib/Database.js";

  interface Props {
    entries: TimeEntry[];
  }

  let { entries }: Props = $props();
</script>

<div class="h-dvh no-scrollbar-list">
  <VirtualList items={entries}>
    {#snippet renderItem(item)}
      <TimerCard {...item} />
    {/snippet}
  </VirtualList>
</div>

<style>
  .no-scrollbar-list :global(div::-webkit-scrollbar) {
    display: none;
  }
  .no-scrollbar-list :global(div) {
    -ms-overflow-style: none;
    scrollbar-width: none;
  }
</style>
