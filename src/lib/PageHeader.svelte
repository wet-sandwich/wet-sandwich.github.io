<script>
  let { title, children } = $props();
</script>

<header
  class="relative z-10 flex items-center justify-between bg-gray-100 p-4 mb-4 shadow-md"
>
  <div class="min-w-0">
    <h1 class="truncate text-xl font-semibold text-slate-900">{title}</h1>
  </div>

  <div class="flex shrink-0 items-center">
    {@render children?.()}
  </div>
</header>
