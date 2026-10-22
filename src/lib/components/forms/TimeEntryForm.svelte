<script lang="ts">
  import {
    DangerButton,
    DatePicker,
    InfoLine,
    Input,
    PrimaryButton,
    SecondaryButton,
  } from "#lib";
  import { formatTimestamp, formatReadable } from "#lib/utils";
  import db from "#lib/Database.ts";

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

  function handleSave() {
    isEditing = false;
    console.log("saving:", task, project, start, end);
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

      <InfoLine name="Duration" value={formatReadable(end - start)} />
    {/if}

    <div class="flex justify-between mt-4">
      <DangerButton onclick={handleDelete} text="Delete" />

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
