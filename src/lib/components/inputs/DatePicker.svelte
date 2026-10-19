<script lang="ts">
  import { DatePicker } from "@svelte-plugins/datepicker";
  import Calendar from "#lib/icons/Calendar.svelte";
  import { formatTimestamp } from "#lib/utils";

  interface Props {
    label: string;
    timestamp: number;
    required?: boolean;
    disabled?: boolean;
  }

  interface DateChangeEvent {
    startDate: number;
  }

  let { label, timestamp = $bindable(), required, disabled }: Props = $props();

  let isOpen = $state(false);
  let displayValue = $derived(formatTimestamp(timestamp));

  const togglePicker = () => (isOpen = !isOpen);

  function handleInput(event: DateChangeEvent) {
    const input = event.startDate;
    timestamp = input;
    displayValue = formatTimestamp(input);
  }
</script>

<DatePicker
  bind:isOpen
  bind:startDate={timestamp}
  showTimePicker
  theme="centered"
  onDateChange={handleInput}
>
  <label
    class="text-sm tracking-wide transition-colors
  {disabled ? 'text-gray-400' : 'text-gray-700'}
  "
  >
    {label}
    {#if required}
      <span class="text-red-500 -ml-0.5">*</span>
    {/if}
    <div class="relative w-full">
      <span class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
        <Calendar />
      </span>
      <input
        type="text"
        value={displayValue}
        onclick={togglePicker}
        {required}
        {disabled}
        class="w-full pl-10 pr-3 py-2 text-sm bg-white border rounded-lg shadow-sm outline-none"
      />
    </div>
  </label>
</DatePicker>

<style>
  :global(.datepicker[data-picker-theme="centered"] .calendars-container.show) {
    position: fixed !important;
    top: 50% !important;
    left: 50% !important;
    right: auto !important;
    translate: -50% -50% !important;
    z-index: 1000;
    max-width: 95vw;
    max-height: 90vh;
    overflow-y: auto;
    box-shadow: 0 0 0 100vmax rgb(0 0 0 / 0.5);
  }
</style>
