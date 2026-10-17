<script lang="ts">
  import { IconButton, PageHeader, SectionHeader, TimerCard } from "#lib";
  import Add from "#lib/icons/Add.svelte";
  import Gear from "#lib/icons/Gear.svelte";

  let current = {
    id: "as56",
    task: "Dev work",
    project: "B-123456",
    start: 1792003353,
  };
  // let current;
  let entries = [
    {
      id: "qw12",
      task: "Dev work",
      project: "B-123456",
      start: 1792003353,
      end: 1792004553,
      duration: 1200,
    },
    {
      id: "er34",
      task: "Analysis",
      project: "B-654321",
      start: 1792004553,
      end: 1792010195,
      duration: 5642,
    },
  ];
</script>

<PageHeader title="Timers">
  <IconButton
    label="Add"
    icon={Add}
    onclick={() => console.log("add timer")}
  />

  <IconButton
    label="Settings"
    icon={Gear}
    onclick={() => console.log("timer settings")}
  />
</PageHeader>

{#if current}
  <SectionHeader>Current</SectionHeader>
  <TimerCard {...current} />
{/if}

<SectionHeader>Activity</SectionHeader>
{#each entries as entry}
  <TimerCard {...entry} />
{/each}
