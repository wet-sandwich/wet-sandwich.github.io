<script lang="ts">
  import {
    InfoLine,
    Input,
    PageHeader,
    SectionHeader,
    SectionText,
  } from "#lib";
  import PersistentState from "#lib/PersistentState.svelte.ts";
  import { compoundGrowth } from "#lib/alpha";
  import GrowthChart from "./GrowthChart.svelte";

  const view = new PersistentState<"table" | "chart">(
    "alpha:compoundView",
    "table",
  );

  let principal: number | null = $state(10000);
  let monthlyContribution: number | null = $state(500);
  let years: number | null = $state(10);
  let rate: number | null = $state(7);

  const MAX_YEARS = 100;

  function valid(n: number | null): number {
    return typeof n === "number" && Number.isFinite(n) && n >= 0 ? n : 0;
  }

  let rows = $derived(
    compoundGrowth({
      principal: valid(principal),
      monthlyContribution: valid(monthlyContribution),
      years: Math.min(Math.floor(valid(years)), MAX_YEARS),
      annualRatePercent: valid(rate),
    }),
  );

  let final = $derived(rows.at(-1));

  const money = new Intl.NumberFormat(undefined, {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  });
</script>

{#snippet viewOption(value: "table" | "chart", label: string)}
  <button
    type="button"
    class="cursor-pointer hover:underline {view.value === value
      ? 'font-bold text-slate-900'
      : 'text-gray-600'}"
    aria-pressed={view.value === value}
    onclick={() => (view.value = value)}
  >
    {label}
  </button>
{/snippet}

<svelte:head>
  <title>Compound Interest · Alpha</title>
</svelte:head>

<PageHeader title="Compound Interest" />

<div class="min-h-0 flex-1 overflow-y-auto pb-6">
  <SectionHeader>Inputs</SectionHeader>
  <form
    class="mx-4 grid grid-cols-1 gap-3 sm:grid-cols-2 md:mx-auto md:w-full md:max-w-lg"
    onsubmit={(e) => e.preventDefault()}
  >
    <Input label="Starting deposit ($)" type="number" min="0" step="any" bind:value={principal} />
    <Input
      label="Monthly contribution ($)"
      type="number"
      min="0"
      step="any"
      bind:value={monthlyContribution}
    />
    <Input label="Years" type="number" min="0" max={MAX_YEARS} step="1" bind:value={years} />
    <Input label="Annual return (%)" type="number" min="0" step="any" bind:value={rate} />
  </form>

  <SectionHeader>Results</SectionHeader>
  {#if final}
    <div class="mx-4 flex flex-col gap-2 md:mx-auto md:w-full md:max-w-lg">
      <InfoLine name="Final balance" value={money.format(final.balance)} />
      <InfoLine name="Contributions" value={money.format(final.contributions)} />
      <InfoLine name="Interest" value={money.format(final.interest)} />
    </div>

    <SectionHeader>
      Balance
      {#snippet actions()}
        <div class="text-sm" role="group" aria-label="Year-by-year view">
          {@render viewOption("table", "Table")}
          <span class="mx-1 text-gray-400" aria-hidden="true">|</span>
          {@render viewOption("chart", "Chart")}
        </div>
      {/snippet}
    </SectionHeader>

    {#if view.value === "chart"}
      <div class="md:mx-auto md:w-full md:max-w-lg">
        <GrowthChart {rows} />
      </div>
    {:else}
    <div class="mx-4 overflow-x-auto md:mx-auto md:w-full md:max-w-lg">
      <table class="w-full text-sm tabular-nums">
        <thead>
          <tr class="border-b border-gray-300 text-left">
            <th class="py-2 pr-2 font-semibold">Year</th>
            <th class="py-2 pr-2 text-right font-semibold">Contributed</th>
            <th class="py-2 pr-2 text-right font-semibold">Interest</th>
            <th class="py-2 text-right font-semibold">Balance</th>
          </tr>
        </thead>
        <tbody>
          {#each rows as row (row.year)}
            <tr class="border-b border-gray-300/60">
              <td class="py-1.5 pr-2">{row.year}</td>
              <td class="py-1.5 pr-2 text-right">{money.format(row.contributions)}</td>
              <td class="py-1.5 pr-2 text-right">{money.format(row.interest)}</td>
              <td class="py-1.5 text-right">{money.format(row.balance)}</td>
            </tr>
          {/each}
        </tbody>
      </table>
    </div>
    {/if}
  {:else}
    <SectionText>Enter a number of years to see results.</SectionText>
  {/if}
</div>
