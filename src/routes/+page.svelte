<script>
  import PageHeader from '../lib/PageHeader.svelte';
  import Add from '../lib/icons/Add.svelte';
  import Gear from '../lib/icons/Gear.svelte';
  import HeaderButton from '../lib/HeaderButton.svelte';
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

<div class="mx-4">
  <p>Visit <a href="https://svelte.dev/docs/kit">svelte.dev/docs/kit</a> to read the documentation</p>
</div>
