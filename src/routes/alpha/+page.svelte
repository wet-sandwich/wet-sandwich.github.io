<script lang="ts">
  import { resolve } from "$app/paths";
  import type { RouteId } from "$app/types";
  import { PageHeader, SectionHeader } from "#lib";

  const tools: { name: string; description: string; href: RouteId }[] = [
    {
      name: "Compound Interest",
      description: "Project growth from a deposit and monthly contributions",
      href: "/alpha/compound",
    },
  ];
</script>

<PageHeader title="Investment Tools" />

<div class="min-h-0 flex-1 overflow-y-auto">
  <SectionHeader>Tools</SectionHeader>
  <ul class="flex flex-col gap-2">
    {#each tools as tool (tool.href)}
      <li>
        <a
          href={resolve(tool.href)}
          class="m-2 flex flex-col rounded-sm bg-white px-4 py-3 shadow-md hover:bg-gray-50 md:mx-auto md:w-full md:max-w-lg"
        >
          <span class="font-semibold text-slate-900">{tool.name}</span>
          <span class="text-sm text-gray-600">{tool.description}</span>
        </a>
      </li>
    {/each}
  </ul>
</div>
