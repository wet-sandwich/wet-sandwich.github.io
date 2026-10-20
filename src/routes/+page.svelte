<script lang="ts">
  import {
    IconButton,
    InfoModal,
    Input,
    PageHeader,
    PrimaryButton,
    SecondaryButton,
    SectionHeader,
    TimerCard,
  } from "#lib";
  import Add from "#lib/icons/Add.svelte";
  import Gear from "#lib/icons/Gear.svelte";
  import {
    currentTimerKey,
    getCurrentTimer,
    startTimer,
    stopTimer,
  } from "#lib/timers.ts";
  import { getTimersBetween, readTimer } from "#lib/db.ts";
  import { startOfPriorDay } from "#lib/utils/time.ts";
  import type { RunningTimer } from "#lib/timers.ts";
  import type { TimeEntry } from "#lib/db.ts";

  let isModalOpen = $state(false);
  let currentTimer: RunningTimer | null = $state(null);
  let entries: TimeEntry[] = $state([]);

  $effect(() => {
    if (!currentTimer) currentTimer = getCurrentTimer();

    async function onStorage(event: StorageEvent) {
      if (event.key === null) {
        currentTimer = null;
        return;
      }
      if (event.key === currentTimerKey && event.newValue === null) {
        currentTimer = null;
        if (!event.oldValue) return;
        const oldValue = JSON.parse(event.oldValue);
        const stoppedTimer = await readTimer(oldValue.id);
        entries.unshift(stoppedTimer);
      }
    }

    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  });

  $effect(() => {
    const weekPrior = startOfPriorDay(7);
    async function fetchTimers() {
      entries = await getTimersBetween(weekPrior);
    }
    fetchTimers();
  });

  const initialData = () => ({
    task: "",
    project: "",
    start: 0,
  });
  let formData = $state(initialData());

  function handleAddTimer() {
    formData.start = Date.now();
    isModalOpen = true;
  }

  function handleSubmit(event: SubmitEvent) {
    stopTimer();
    event.preventDefault();
    isModalOpen = false;
    currentTimer = startTimer(formData.task, formData.project, formData.start);
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

{#if currentTimer}
  <SectionHeader>Current</SectionHeader>
  <TimerCard {...currentTimer} />
{/if}

<SectionHeader>Activity</SectionHeader>
{#if entries.length}
  {#each entries as entry}
    <TimerCard {...entry} />
  {/each}
{:else}
  <p class="px-4">No recent activity.</p>
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
