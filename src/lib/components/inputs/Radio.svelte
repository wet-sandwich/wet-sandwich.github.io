<script lang="ts">
  import type PersistentState from "#lib/PersistentState.svelte.ts";

  interface Props {
    state: PersistentState<string>;
    name: string;
    legend: string;
    options: { name: string; value: string }[];
  }
  let { state, name, legend, options }: Props = $props();
</script>

<fieldset>
  <legend class="font-semibold">{legend}</legend>
  <div class="mt-2 flex flex-row gap-4">
    {#each options as option (option.name)}
      <label
        class="flex flex-1 cursor-pointer select-none items-center gap-2 rounded-lg border border-gray-200 bg-gray-50 px-4 py-4 text-sm font-medium text-gray-900"
      >
        <input
          type="radio"
          {name}
          value={option.value}
          bind:group={state.value}
          class="h-4 w-4 border-gray-300 bg-gray-100 text-slate-900 checked:border-slate-900 checked:bg-slate-900 focus:ring-2 focus:ring-slate-500"
        />
        {option.name}
      </label>
    {/each}
  </div>
</fieldset>
