<script lang="ts">
  import { IconButton, PageHeader } from "#lib";
  import Gear from '#lib/icons/Gear.svelte';
</script>

<PageHeader title="Reports">
  <IconButton
    label="Settings"
    icon={Gear}
    onclick={() => console.log("report settings")}
  />
</PageHeader>

<div class="mx-4">
  <p>Placeholder for reports page</p>
</div>
