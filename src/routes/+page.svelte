<script>
  import PageHeader from "../lib/PageHeader.svelte";
  import Add from "../lib/icons/Add.svelte";
  import Gear from "../lib/icons/Gear.svelte";
  import HeaderButton from "../lib/HeaderButton.svelte";
  import TimeCard from "../lib/TimeCard.svelte";

  let current = {
    id: "as56",
    task: "dev work",
    project: "B-123456",
    start: 1792003353,
  };
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

<h2>Current</h2>
<TimeCard {...current} />

<h2>Activity</h2>
{#each entries as entry}
  <TimeCard {...entry} />
{/each}
