<script lang="ts">
  import {
    IconButton,
    InfoModal,
    Input,
    PageHeader,
    PrimaryButton,
    SecondaryButton,
    SectionHeader,
    SectionText,
    TimerCard,
    ActivityViewer,
  } from "#lib";
  import { onMount } from "svelte";
  import Add from "#lib/icons/Add.svelte";
  import Gear from "#lib/icons/Gear.svelte";
  import { startOfPriorDay } from "#lib/utils/time.ts";
  import timer from "#lib/ActiveTimer.svelte.ts";
  import db from "#lib/Database";
  import type { TimeEntry } from "#lib/Database.ts";

  let isModalOpen = $state(false);
  let entries: TimeEntry[] = $state([]);

  onMount(() => {
    const weekPrior = startOfPriorDay(7);
    async function fetchTimers() {
      entries = await db.getTimersBetween(weekPrior);
    }
    fetchTimers();

    const unsubOnAdd = db.on("add", (payload) => {
      entries.unshift(payload.item);
    });

    const unsubOnDel = db.on("delete", (payload) => {
      const { key } = payload;
      entries = entries.filter((i) => i.id !== key);
    });

    const unsubOnUpdate = db.on("update", (payload) => {
      const { item } = payload;
      const index = entries.findIndex((e) => e.id === item.id);
      if (index >= 0) {
        entries[index] = item;
      }
    });

    return () => {
      unsubOnAdd();
      unsubOnDel();
      unsubOnUpdate();
    };
  });

  const initialData = () => ({
    task: "",
    project: "",
  });
  let formData = $state(initialData());

  function handleAddTimer() {
    isModalOpen = true;
  }

  async function handleSubmit(event: SubmitEvent) {
    event.preventDefault();
    isModalOpen = false;
    await timer.start(formData.task, formData.project);
    Object.assign(formData, initialData());
  }
</script>

<PageHeader title="Timers">
  <IconButton label="Add" icon={Add} onclick={handleAddTimer} />

  <IconButton
    label="Settings"
    icon={Gear}
    onclick={() => console.log("timer settings")}
  />
</PageHeader>

<SectionHeader>Current</SectionHeader>
{#if timer.current}
  <TimerCard {...timer.current} />
{:else}
  <SectionText>No active timer.</SectionText>
{/if}

<SectionHeader>Activity</SectionHeader>
{#if entries.length}
  <ActivityViewer {entries} />
{:else}
  <SectionText>No recent activity.</SectionText>
{/if}

<InfoModal bind:show={isModalOpen} title="New Timer">
  <form onsubmit={handleSubmit}>
    <Input label="Task" bind:value={formData.task} required />

    <Input label="Project" bind:value={formData.project} required />

    <div class="flex justify-end mt-4 gap-4">
      <SecondaryButton
        type="reset"
        onclick={() => (isModalOpen = false)}
        text="Cancel"
      />

      <PrimaryButton type="submit" text="Start" />
    </div>
  </form>
</InfoModal>
