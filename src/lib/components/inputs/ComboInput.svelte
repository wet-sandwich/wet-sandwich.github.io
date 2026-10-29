<script lang="ts">
  import type { HTMLInputAttributes } from "svelte/elements";

  interface Props {
    label: string;
    value?: string;
    options: string[];
    placeholder?: string;
    required?: boolean;
    disabled?: boolean;
  }

  let {
    label,
    value = $bindable(""),
    options,
    placeholder = "",
    required = false,
    disabled = false,
    ...rest
  }: Props & Omit<HTMLInputAttributes, "value"> = $props();

  const id = $props.id();
  const listId = `${id}-list`;

  let open = $state(false);
  let active = $state(-1);
  let listEl: HTMLUListElement | undefined = $state();

  const filtered = $derived.by(() => {
    const query = value.trim().toLowerCase();
    if (!query) return options;
    return options.filter((o) => o.toLowerCase().includes(query));
  });

  const showList = $derived(open && filtered.length > 0);

  function select(option: string) {
    value = option;
    open = false;
    active = -1;
  }

  function move(step: number) {
    if (!open) open = true;
    const count = filtered.length;
    if (!count) return;
    active = (active + step + count) % count;
    listEl?.children[active]?.scrollIntoView({ block: "nearest" });
  }

  function onkeydown(e: KeyboardEvent) {
    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        move(1);
        break;
      case "ArrowUp":
        e.preventDefault();
        move(-1);
        break;
      case "Enter":
        if (showList && active >= 0) {
          e.preventDefault();
          select(filtered[active]);
        }
        break;
      case "Escape":
        if (open) {
          e.preventDefault();
          open = false;
          active = -1;
        }
        break;
    }
  }

  function oninput() {
    open = true;
    active = -1;
  }
</script>

<div class="relative">
  <label
    for={id}
    class="text-sm tracking-wide transition-colors
    {disabled ? 'text-gray-400' : 'text-gray-700'}"
  >
    {label}
    {#if required}
      <span class="text-red-500 -ml-0.5">*</span>
    {/if}
  </label>
  <input
    {...rest}
    {id}
    type="text"
    role="combobox"
    autocomplete="off"
    aria-autocomplete="list"
    aria-expanded={showList}
    aria-controls={listId}
    aria-activedescendant={showList && active >= 0
      ? `${id}-opt-${active}`
      : undefined}
    {placeholder}
    {required}
    {disabled}
    bind:value
    {oninput}
    {onkeydown}
    onfocus={() => (open = true)}
    onblur={() => {
      open = false;
      active = -1;
    }}
    class="w-full px-3 py-2 text-sm bg-white border rounded-lg shadow-sm outline-none"
  />

  {#if showList}
    <ul
      bind:this={listEl}
      id={listId}
      role="listbox"
      aria-label={label}
      class="absolute z-20 mt-1 max-h-48 w-full overflow-y-auto rounded-lg border bg-white py-1 text-sm shadow-md"
    >
      {#each filtered as option, i (option)}
        <li
          id="{id}-opt-{i}"
          role="option"
          aria-selected={i === active}
          class="cursor-pointer px-3 py-2 {i === active
            ? 'bg-gray-100'
            : 'hover:bg-gray-50'}"
          onpointerdown={(e) => {
            // Keep focus in the input so blur doesn't close the list first.
            e.preventDefault();
            select(option);
          }}
          onpointerenter={() => (active = i)}
        >
          {option}
        </li>
      {/each}
    </ul>
  {/if}
</div>
