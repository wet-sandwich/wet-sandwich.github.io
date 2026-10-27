<script lang="ts">
  import VirtualList from "@humanspeak/svelte-virtual-list";
  import { TimerCard, SubHeader } from "#lib";
  import type { ActivityRow } from "../utils";

  interface Props {
    entries: ActivityRow[];
  }

  let { entries }: Props = $props();
</script>

<div class="min-h-0 flex-1 no-scrollbar-list">
  <VirtualList items={entries}>
    {#snippet renderItem(item)}
      {#if item.type === "header"}
        <SubHeader>{item.label}</SubHeader>
      {:else}
        <TimerCard {...item.entry} />
      {/if}
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
