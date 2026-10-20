import { createTimer } from "#lib/db.ts";

export const currentTimerKey = "currentTimer";

export interface RunningTimer {
  id: string;
  task: string;
  project: string;
  start: number;
}

export function getCurrentTimer(): RunningTimer | null {
  const stored = localStorage.getItem(currentTimerKey);
  if (!stored) return null;
  try {
    const current = JSON.parse(stored);
    console.debug("current:", current)
    return current;
  } catch (e) {
    console.error("Error stopping timer:", e);
    return null;
  }
}

export function startTimer(task: string, project: string, start: number): RunningTimer {
  const id = crypto.randomUUID();
  const timer = { id, task, project, start };
  localStorage.setItem(currentTimerKey, JSON.stringify(timer));
  return timer;
}

export async function stopTimer() {
  const stored = localStorage.getItem(currentTimerKey);
  if (!stored) return;
  try {
    const current = JSON.parse(stored);
    await createTimer({ ...current, end: Date.now() });
    console.log(`stopping timer at ${Date.now()}:`, current);
    localStorage.removeItem(currentTimerKey);
    window.dispatchEvent(
      new StorageEvent("storage", { key: currentTimerKey, oldValue: JSON.stringify(current), newValue: null, storageArea: localStorage })
    );
  } catch (e) {
    console.error("Error stopping timer:", e);
  }
}
