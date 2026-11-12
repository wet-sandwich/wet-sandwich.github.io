import { browser } from "$app/env";
import db from "#lib/timeit/Database.ts";
import { migrateStorageKey } from "#lib/storage.ts";

export interface ActiveTimer {
  id: string;
  task: string;
  project: string;
  start: number;
}

class Timer {
  #key = "timeit:currentTimer";
  current: ActiveTimer | null = $state(null);

  constructor() {
    this.current = this.#getCurrentTimer();
  }

  #getCurrentTimer(): ActiveTimer | null {
    if (!browser) return null;
    migrateStorageKey("currentTimer", this.#key);
    const stored = localStorage.getItem(this.#key);
    if (!stored) return null;
    try {
      const current = JSON.parse(stored);
      return current;
    } catch (e) {
      console.error("Error getting current timer:", e);
      return null;
    }
  }

  async stop(): Promise<void> {
    if (!this.current) return;
    await db.createTimer({ ...this.current, end: Date.now() });
    localStorage.removeItem(this.#key);
    this.current = null;
  }

  async start(task: string, project: string): Promise<void> {
    await this.stop();
    const id = crypto.randomUUID();
    this.current = { id, task, project, start: Date.now() };
    localStorage.setItem(this.#key, JSON.stringify(this.current));
    await db.touchProject(project);
  }

  async edit(timer: ActiveTimer): Promise<void> {
    if (!this.current) return;
    this.current = timer;
    localStorage.setItem(this.#key, JSON.stringify(timer));
    await db.touchProject(timer.project);
  }

  delete(): void {
    this.current = null;
    localStorage.removeItem(this.#key);
  }
}

const timer = new Timer();
export default timer;
