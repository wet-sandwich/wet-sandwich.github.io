<script lang="ts">
  import PageHeader from "../lib/PageHeader.svelte";
  import Add from "../lib/icons/Add.svelte";
  import Gear from "../lib/icons/Gear.svelte";
  import HeaderButton from "../lib/HeaderButton.svelte";
  import TimeCard from "../lib/TimeCard.svelte";
  import SectionHeader from "../lib/SectionHeader.svelte";

  let current = {
    id: "as56",
    task: "dev work",
    project: "B-123456",
    start: 1792003353,
  };
  // let current;
  let entries = [
    {
      id: "qw12",
      task: "dev work",
      project: "B-123456",
      start: 1792003353,
      end: 1792004553,
      duration: 1200,
    },
    {
      id: "er34",
      task: "analysis",
      project: "B-654321",
      start: 1792004553,
      end: 1792010195,
      duration: 5642,
    },
  ];
</script>

<PageHeader title="Timer">
  <HeaderButton
    label="Add"
    icon={Add}
    onclick={() => console.log("add timer")}
  />

  <HeaderButton
    label="Settings"
    icon={Gear}
    onclick={() => console.log("timer settings")}
  />
</PageHeader>

{#if current}
  <SectionHeader>Current</SectionHeader>
  <TimeCard {...current} />
{/if}

<SectionHeader>Activity</SectionHeader>
{#each entries as entry}
  <TimeCard {...entry} />
{/each}
