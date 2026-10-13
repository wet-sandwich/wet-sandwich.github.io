<script>
  import PageHeader from '../../lib/PageHeader.svelte';
  import Gear from '../../lib/icons/Gear.svelte';
  import HeaderButton from '../../lib/HeaderButton.svelte';
</script>

<PageHeader title="Reports">
  <HeaderButton
    label="Settings"
    icon={Gear}
    onclick={() => console.log("report settings")}
  />
</PageHeader>

<div class="mx-4">
  <p>Placeholder for reports page</p>
</div>
