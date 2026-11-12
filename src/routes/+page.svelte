<script lang="ts">
  import { resolve } from "$app/paths";
  import { SectionHeader } from "#lib";
  import { apps } from "#lib/apps.ts";
</script>

<svelte:head>
  <title>Apps</title>
</svelte:head>

<header
  class="flex h-[60px] shrink-0 items-center bg-slate-900 px-5 text-white"
>
  <h1 class="text-xl font-bold">Apps</h1>
</header>

<main class="min-h-0 flex-1 overflow-y-auto py-4">
  <SectionHeader>Choose an app</SectionHeader>
  <ul class="flex flex-col gap-2">
    {#each apps as app (app.id)}
      <li>
        <a
          href={resolve(app.href)}
          class="m-2 flex items-center gap-4 rounded-sm bg-white px-4 py-3 shadow-md hover:bg-gray-50 md:mx-auto md:w-full md:max-w-lg"
        >
          <span class="text-slate-900"><app.icon /></span>
          <span class="flex flex-col">
            <span class="font-semibold text-slate-900">{app.name}</span>
            <span class="text-sm text-gray-600">{app.description}</span>
          </span>
        </a>
      </li>
    {/each}
  </ul>
</main>
