<script lang="ts">
  import type { LayoutProps } from "./$types";
  import { Navbar } from "#lib";

  let { children }: LayoutProps = $props();
</script>

<svelte:head>
  <title>Time-It</title>
</svelte:head>

<Navbar
  title="Time-It"
  home="/timeit"
  links={[
    { href: "/timeit", label: "Timers" },
    { href: "/timeit/reports", label: "Reports" },
  ]}
/>

<main class="flex min-h-0 flex-1 flex-col">
  {@render children()}
</main>
