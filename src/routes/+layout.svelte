<script lang="ts">
	import "@fontsource-variable/roboto-flex/index.css";
	import "../app.css";
	import favicon from "#lib/assets/favicon.svg";
	import type { LayoutProps } from "./$types";

	let { children }: LayoutProps = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<div class="flex h-dvh flex-col">
	{@render children()}
</div>
