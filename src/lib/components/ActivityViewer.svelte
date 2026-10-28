<script lang="ts">
  import VirtualList from "@humanspeak/svelte-virtual-list";
  import { TimerCard, SubHeader } from "#lib";
  import type { ActivityRow } from "../utils";

  interface Props {
    entries: ActivityRow[];
  }

  let { entries }: Props = $props();

  let container: HTMLDivElement | undefined = $state();
  let stickyHeight = $state(0);
  let topVisibleRow = $state(0);
  let pushOffset = $state(0);

  const headerIndices = $derived.by(() => {
    let last = -1;
    return entries.map((row, i) => (row.type === "header" ? (last = i) : last));
  });

  const stickyLabel = $derived.by(() => {
    const row = entries[headerIndices[topVisibleRow] ?? -1];
    return row?.type === "header" ? row.label : null;
  });

  function update() {
    if (!container) return;
    const top = container.getBoundingClientRect().top;
    const rows = [...container.querySelectorAll<HTMLElement>("[data-svl-item]")]
      .map((el) => ({
        index: Number(el.dataset.originalIndex),
        rect: el.getBoundingClientRect(),
      }))
      .sort((a, b) => a.index - b.index);

    const first = rows.find((r) => r.rect.bottom > top);
    if (!first) return;
    topVisibleRow = first.index;

    const nextHeader = rows.find(
      (r) => r.index > first.index && entries[r.index]?.type === "header",
    );
    const gap = nextHeader ? nextHeader.rect.top - top : Infinity;
    pushOffset = Math.min(0, gap - stickyHeight);
  }

  $effect(() => {
    void entries;
    requestAnimationFrame(update);
  });
</script>

<div
  bind:this={container}
  class="relative min-h-0 flex-1 overflow-hidden no-scrollbar-list"
  onscrollcapture={update}
>
  <VirtualList items={entries} onRangeChange={update}>
    {#snippet renderItem(item)}
      {#if item.type === "header"}
        <SubHeader>{item.label}</SubHeader>
      {:else}
        <TimerCard {...item.entry} />
      {/if}
    {/snippet}
  </VirtualList>

  {#if stickyLabel}
    <div
      bind:offsetHeight={stickyHeight}
      class="pointer-events-none absolute inset-x-0 top-0 z-10 flow-root bg-gray-200"
      style:transform="translateY({pushOffset}px)"
      aria-hidden="true"
    >
      <SubHeader>{stickyLabel}</SubHeader>
    </div>
  {/if}
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
