<script lang="ts">
  import { DangerButton, InfoLine, PrimaryButton, SecondaryButton } from "#lib";
  import { formatTimestamp, formatReadable } from "#lib/utils";

  interface Props {
    id: string;
    task: string;
    project: string;
    start: number;
    end?: number;
    duration?: number;
  }

  let { task, project, start, end, duration }: Props = $props();

  let isEditing = $state(false);
</script>

<article class="flex flex-col gap-2 px-1">
  {#if !isEditing}
    <InfoLine name="Task" value={task} />

    <InfoLine name="Project" value={project} />

    <InfoLine name="Start" value={formatTimestamp(start)} />

    {#if end}
      <InfoLine name="End" value={formatTimestamp(end)} />
    {/if}

    {#if duration}
      <InfoLine name="Duration" value={formatReadable(duration)} />
    {/if}

    <div class="flex justify-between mt-4">
      <DangerButton onclick={() => console.log("delete me!")} text="Delete" />

      <SecondaryButton onclick={() => (isEditing = true)} text="Edit" />
    </div>
  {:else}
    <input type="text" placeholder={task} />

    <input type="text" placeholder={project} />

    <div class="flex justify-end mt-4 gap-4">
      <SecondaryButton onclick={() => (isEditing = false)} text="Cancel" />

      <PrimaryButton onclick={() => (isEditing = false)} text="Save" />
    </div>
  {/if}
</article>
