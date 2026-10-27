<script lang="ts">
	import "@fontsource-variable/roboto-flex/index.css";
	import "../app.css";
	import favicon from "#lib/assets/favicon.svg";
	import type { LayoutProps } from "./$types";
	import { Navbar } from "#lib";

	let { children }: LayoutProps = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<div class="flex h-dvh flex-col">
	<Navbar />

	<main class="flex min-h-0 flex-1 flex-col">
		{@render children()}
	</main>
</div>
