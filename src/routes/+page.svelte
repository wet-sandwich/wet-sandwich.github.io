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
  } from "#lib";
  import { onMount } from "svelte";
  import Add from "#lib/icons/Add.svelte";
  import Gear from "#lib/icons/Gear.svelte";
  import {
    currentTimerKey,
    getCurrentTimer,
    startTimer,
    stopTimer,
  } from "#lib/timers.ts";
  import { startOfPriorDay } from "#lib/utils/time.ts";
  import db from "#lib/Database";
  import type { RunningTimer } from "#lib/timers.ts";
  import type { TimeEntry } from "#lib/Database.ts";

  let isModalOpen = $state(false);
  let currentTimer: RunningTimer | null = $state(null);
  let entries: TimeEntry[] = $state([]);

  onMount(() => {
    currentTimer = getCurrentTimer();

    const weekPrior = startOfPriorDay(7);
    async function fetchTimers() {
      entries = await db.getTimersBetween(weekPrior);
    }
    fetchTimers();

    const unsubOnAdd = db.on("add", (payload) => {
      console.log("onAddEvent::payload:", payload);
      entries.unshift(payload.item);
    });

    const unsubOnDel = db.on("delete", (payload) => {
      const { key } = payload;
      console.log("onDelEvent::payload:", payload);
      entries = entries.filter((i) => i.id !== key);
    });

    async function onStorage(event: StorageEvent) {
      if (event.key === null) {
        currentTimer = null;
        return;
      }
      if (event.key === currentTimerKey && event.newValue === null) {
        currentTimer = null;
      }
    }

    window.addEventListener("storage", onStorage);

    return () => {
      window.removeEventListener("storage", onStorage);
      unsubOnAdd();
      unsubOnDel();
    };
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

<SectionHeader>Current</SectionHeader>
{#if currentTimer}
  <TimerCard {...currentTimer} />
{:else}
  <SectionText>No active timer.</SectionText>
{/if}

<SectionHeader>Activity</SectionHeader>
{#if entries.length}
  {#each entries as entry}
    <TimerCard {...entry} />
  {/each}
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
