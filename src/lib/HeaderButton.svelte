<script>
  let { onclick, icon: Icon, label } = $props();
</script>

<button
  type="button"
  aria-label={label}
  {onclick}
  class="flex h-10 w-10 items-center justify-center rounded-full text-slate-600
    cursor-pointer transition hover:bg-slate-200 hover:text-slate-900
    focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
>
  <Icon />
</button>
