<script lang="ts">
  import {
    IconButton,
    InfoModal,
    Input,
    ComboInput,
    PageHeader,
    PrimaryButton,
    SecondaryButton,
    SectionHeader,
    SectionText,
    TimerCard,
    ActivityViewer,
    DatePicker,
  } from "#lib";
  import { onMount } from "svelte";
  import Add from "#lib/icons/Add.svelte";
  import Gear from "#lib/icons/Gear.svelte";
  import Filter from "#lib/icons/Filter.svelte";
  import { organizeEntries } from "#lib/utils";
  import timer from "#lib/ActiveTimer.svelte.ts";
  import projects from "#lib/Projects.svelte.ts";
  import db from "#lib/Database";
  import type { TimeEntry } from "#lib/Database.ts";

  const PAGE_SIZE = 30;

  let isTimerFormOpen = $state(false);
  let isFilterFormOpen = $state(false);
  let entries: TimeEntry[] = $state([]);
  let hasMore = $state(true);

  let loadedUntil = Infinity;
  let loading = false;

  async function loadMore() {
    if (loading || !hasMore) return;
    loading = true;
    try {
      const older = await db.getTimersBefore(loadedUntil, PAGE_SIZE + 1);
      hasMore = older.length > PAGE_SIZE;
      const page = older.slice(0, PAGE_SIZE);
      if (page.length) loadedUntil = page[page.length - 1].start;
      entries.push(...page);
    } catch (error) {
      console.error("Failed to load timers:", error);
    } finally {
      loading = false;
    }
  }

  onMount(() => {
    loadMore();

    const unsubOnAdd = db.on("addTimer", (payload) => {
      entries.unshift(payload.item);
    });

    const unsubOnDel = db.on("deleteTimer", (payload) => {
      const { key } = payload;
      entries = entries.filter((i) => i.id !== key);
    });

    const unsubOnUpdate = db.on("updateTimer", (payload) => {
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

  const initialFormData = () => ({
    task: "",
    project: "",
  });
  let formData = $state(initialFormData());

  const initialFilterData = () => ({
    project: "",
    begin: -Infinity,
    end: Infinity,
  });
  let filterData = $state(initialFilterData());

  function handleAddTimer() {
    isTimerFormOpen = true;
  }

  async function handleSubmit(event: SubmitEvent) {
    event.preventDefault();
    isTimerFormOpen = false;
    await timer.start(formData.task, formData.project);
    Object.assign(formData, initialFormData());
  }

  async function handleApplyFilters() {
    try {
      entries = await db.searchTimers(filterData.project, filterData.begin, filterData.end);
    } catch (error) {
      console.error("Failed to search timers:", error);
    } finally {
      isFilterFormOpen = false;
    }
  }

  function handleClearFilters() {
    isFilterFormOpen = false;
    Object.assign(filterData, initialFilterData());
    loadedUntil = Infinity;
    hasMore = true;
    entries = [];
    loadMore();
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

<SectionHeader>
  <div class="flex flex-row justify-between">
    Activity
    <IconButton label="Filter" icon={Filter} onclick={() => (isFilterFormOpen = true)} />
  </div>
</SectionHeader>
{#if entries.length}
  <ActivityViewer
    entries={organizeEntries(entries)}
    onLoadMore={loadMore}
    {hasMore}
  />
{:else}
  <SectionText>No recent activity.</SectionText>
{/if}

<InfoModal bind:show={isTimerFormOpen} title="New Timer">
  <form onsubmit={handleSubmit}>
    <Input label="Task" bind:value={formData.task} required />

    <ComboInput
      label="Project"
      options={projects.names}
      bind:value={formData.project}
      required
    />

    <div class="flex justify-end mt-4 gap-4">
      <SecondaryButton
        type="reset"
        onclick={() => (isTimerFormOpen = false)}
        text="Cancel"
      />

      <PrimaryButton type="submit" text="Start" />
    </div>
  </form>
</InfoModal>

<InfoModal bind:show={isFilterFormOpen} title="Filter Entries">
  <form onsubmit={handleApplyFilters} class="flex flex-col gap-2 px-1">
    <ComboInput
      label="Project"
      options={projects.names}
      bind:value={filterData.project}
    />

    <DatePicker
      label="Start Date"
      bind:timestamp={filterData.begin}
      time={false}
    />

    <DatePicker label="End Date" bind:timestamp={filterData.end} time={false} />

    <div class="flex justify-end mt-4 gap-4">
      <SecondaryButton type="reset" onclick={handleClearFilters} text="Reset" />
      <PrimaryButton type="submit" text="Apply" />
    </div>
  </form>
</InfoModal>
