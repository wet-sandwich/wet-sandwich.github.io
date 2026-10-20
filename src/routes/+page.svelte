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
  import { currentTimerKey, getCurrentTimer, startTimer, stopTimer } from "#lib/timers.ts";
  import type { RunningTimer } from "#lib/timers.ts";

  let isModalOpen = $state(false);
  let currentTimer: RunningTimer | null = $state(null);

  $effect(() => {
    if (!currentTimer) currentTimer = getCurrentTimer();

    function onStorage(event: StorageEvent) {
      if (event.key === null) {
        currentTimer = null;
        return;
      }
      if (event.key === currentTimerKey && event.newValue === null) {
        currentTimer = null;
      }
    }

    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
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

  let entries = [
    {
      id: "qw12",
      task: "Dev work",
      project: "B-123456",
      start: 1792003353000,
      end: 1792004553000,
    },
    {
      id: "er34",
      task: "Analysis",
      project: "B-654321",
      start: 1792004553000,
      end: 1792010195000,
    },
  ];
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
{#each entries as entry}
  <TimerCard {...entry} />
{/each}

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
