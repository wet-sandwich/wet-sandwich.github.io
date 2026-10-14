<script>
  import PageHeader from '../lib/PageHeader.svelte';
  import Add from '../lib/icons/Add.svelte';
  import Gear from '../lib/icons/Gear.svelte';
  import HeaderButton from '../lib/HeaderButton.svelte';
  import TimeCard from '../lib/TimeCard.svelte';

  let entries = [
    { task: "dev work", project: "B-123456", time: 1200 },
    { task: "analysis", project: "B-654321", time: 5642 },
  ]
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

{#each entries as entry}
  <TimeCard {...entry} />
{/each}
