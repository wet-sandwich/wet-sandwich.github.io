<script lang="ts">
  let open = $state(false);

  const links = [
    { href: '/', label: 'Timer' },
    { href: '/reports', label: 'Reports' }
  ];

  function close() {
    open = false;
  }

  function onkeydown(e: KeyboardEvent) {
    if (e.key === 'Escape') close();
  }
</script>

<svelte:window {onkeydown} />

<header
  class="sticky top-0 z-50 flex h-[60px] items-center justify-between bg-slate-900 px-5 text-white"
>
  <a href="/" class="text-xl font-bold" onclick={close}>Time-It</a>

  <button
    class="flex h-10 w-10 flex-col justify-center gap-[5px] p-2 md:hidden"
    aria-label={open ? 'Close menu' : 'Open menu'}
    aria-expanded={open}
    aria-controls="main-nav"
    onclick={() => (open = !open)}
  >
    <span
      class="block h-[3px] w-full rounded bg-white transition duration-300
        {open ? 'translate-y-2 rotate-45' : ''}"
    ></span>
    <span
      class="block h-[3px] w-full rounded bg-white transition duration-300
        {open ? 'opacity-0' : ''}"
    ></span>
    <span
      class="block h-[3px] w-full rounded bg-white transition duration-300
        {open ? '-translate-y-2 -rotate-45' : ''}"
    ></span>
  </button>

  <nav
    id="main-nav"
    class="absolute left-0 right-0 top-[60px] overflow-hidden bg-slate-900
      transition-[max-height] duration-300 ease-in-out
      md:static md:max-h-none md:overflow-visible md:bg-transparent
      {open ? 'max-h-96' : 'max-h-0'}"
  >
    <ul class="flex flex-col px-5 pb-4 pt-2 md:flex-row md:gap-6 md:p-0">
      {#each links as link}
        <li>
          <a
            href={link.href}
            onclick={close}
            class="block py-3 hover:underline md:py-0"
          >
            {link.label}
          </a>
        </li>
      {/each}
    </ul>
  </nav>
</header>
