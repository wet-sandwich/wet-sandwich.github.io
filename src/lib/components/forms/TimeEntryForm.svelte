<script lang="ts">
  import {
    DangerButton,
    DatePicker,
    InfoLine,
    Input,
    PrimaryButton,
    SecondaryButton,
  } from "#lib";
  import { formatTimestamp, formatHoursMinutes } from "#lib/utils";
  import { editTimer } from "#lib/timers.ts";
  import db from "#lib/Database.ts";
  import ConfirmModal from "../modals/ConfirmModal.svelte";

  interface Props {
    id: string;
    task: string;
    project: string;
    start: number;
    end?: number;
    show: boolean;
  }

  let { id, task, project, start, end, show = $bindable() }: Props = $props();

  let isEditing = $state(false);
  let isConfirmOpen = $state(false);

  function handleSave() {
    isEditing = false;
    if (!end) {
      editTimer({ id, task, project, start });
    } else {
      db.updateTimer({ id, task, project, start, end });
    }
    console.log();
  }

  function confirmDelete() {
    isConfirmOpen = true;
  }

  async function handleDelete() {
    await db.deleteTimer(id);
    show = false;
  }
</script>

<article class="flex flex-col gap-2 px-1">
  {#if !isEditing}
    <InfoLine name="Task" value={task} />

    <InfoLine name="Project" value={project} />

    <InfoLine name="Start" value={formatTimestamp(start)} />

    {#if end}
      <InfoLine name="End" value={formatTimestamp(end)} />

      <InfoLine name="Duration" value={formatHoursMinutes(end - start)} />
    {/if}

    <div class="flex justify-between mt-4">
      <DangerButton onclick={confirmDelete} text="Delete" />

      <SecondaryButton onclick={() => (isEditing = true)} text="Edit" />
    </div>
  {:else}
    <Input label="Task" bind:value={task} required />

    <Input label="Project" bind:value={project} />

    <DatePicker label="Start" bind:timestamp={start} />

    {#if end}
      <DatePicker label="End" bind:timestamp={end} />
    {/if}

    <div class="flex justify-end mt-4 gap-4">
      <SecondaryButton onclick={() => (isEditing = false)} text="Cancel" />

      <PrimaryButton onclick={handleSave} text="Save" />
    </div>
  {/if}
</article>

<ConfirmModal
  bind:show={isConfirmOpen}
  text="Are you sure you want to delete this time entry?"
  buttonText="Delete"
  callback={handleDelete}
/>
