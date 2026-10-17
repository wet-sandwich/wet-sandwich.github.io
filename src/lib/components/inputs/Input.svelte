<script lang="ts">
  import type { HTMLInputAttributes } from "svelte/elements";

  interface Props {
    label: string;
    value?: string | number;
    type?: HTMLInputAttributes["type"];
    placeholder?: string;
    required?: boolean;
    disabled?: boolean;
  }

  let {
    label,
    value = $bindable(""),
    type = "text",
    placeholder = "",
    required = false,
    disabled = false,
    ...rest
  }: Props & HTMLInputAttributes = $props();
</script>

<label
  class="text-sm tracking-wide transition-colors
  {disabled ? 'text-gray-400' : 'text-gray-700'}
  "
>
  {label}
  {#if required}
    <span class="text-red-500 -ml-0.5">*</span>
  {/if}
  <input
    {type}
    {placeholder}
    {required}
    {disabled}
    bind:value
    {...rest}
    class="w-full px-3 py-2 text-sm bg-white border rounded-lg shadow-sm outline-none"
  />
</label>
