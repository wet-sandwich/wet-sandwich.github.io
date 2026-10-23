import db from "#lib/Database.ts";

export const currentTimerKey = "currentTimer";

export interface ActiveTimer {
  id: string;
  task: string;
  project: string;
  start: number;
}

export function getCurrentTimer(): ActiveTimer | null {
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

export function startTimer(task: string, project: string, start: number): ActiveTimer {
  const id = crypto.randomUUID();
  const timer = { id, task, project, start };
  localStorage.setItem(currentTimerKey, JSON.stringify(timer));
  return timer;
}

export function editTimer(timer: ActiveTimer): void {
  const stored = localStorage.getItem(currentTimerKey);
  if (!stored) return;
  try {
    const current = JSON.parse(stored);
    localStorage.setItem(currentTimerKey, JSON.stringify(timer));
    window.dispatchEvent(
      new StorageEvent("storage", { key: currentTimerKey, oldValue: JSON.stringify(current), newValue: JSON.stringify(timer), storageArea: localStorage })
    );
  } catch (e) {
    console.error("Error updating active timer:", e);
  }
}

export async function stopTimer() {
  const stored = localStorage.getItem(currentTimerKey);
  if (!stored) return;
  try {
    const current = JSON.parse(stored);
    await db.createTimer({ ...current, end: Date.now() });
    console.log(`stopping timer at ${Date.now()}:`, current);
    localStorage.removeItem(currentTimerKey);
    window.dispatchEvent(
      new StorageEvent("storage", { key: currentTimerKey, oldValue: JSON.stringify(current), newValue: null, storageArea: localStorage })
    );
  } catch (e) {
    console.error("Error stopping timer:", e);
  }
}

export function deleteTimer() {
  const stored = localStorage.getItem(currentTimerKey);
  if (!stored) return;
  localStorage.removeItem(currentTimerKey);
  window.dispatchEvent(
    new StorageEvent("storage", { key: currentTimerKey, oldValue: stored, newValue: null, storageArea: localStorage })
  );
}
