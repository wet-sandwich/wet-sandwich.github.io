<script lang="ts">
  import type { LayoutProps } from "./$types";
  import { Navbar } from "#lib";

  let { children }: LayoutProps = $props();
</script>

<svelte:head>
  <title>Alpha</title>
</svelte:head>

<!-- Add a link here for each new Alpha tool page (e.g. /alpha/<tool>). -->
<Navbar
  title="Alpha"
  home="/alpha"
  links={[
    { href: "/alpha", label: "Tools" },
    { href: "/alpha/compound", label: "Compound Interest" },
  ]}
/>

<main class="flex min-h-0 flex-1 flex-col">
  {@render children()}
</main>
