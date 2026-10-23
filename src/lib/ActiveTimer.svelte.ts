import { browser } from "$app/env";
import db from "#lib/Database.ts";

export interface ActiveTimer {
  id: string;
  task: string;
  project: string;
  start: number;
}

class Timer {
  #key = "currentTimer";
  current: ActiveTimer | null = $state(null);

  constructor() {
    this.current = this.#getCurrentTimer();
  }

  #getCurrentTimer(): ActiveTimer | null {
    if (!browser) return null;
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
  }

  edit(timer: ActiveTimer): void {
    if (!this.current) return;
    this.current = timer;
    localStorage.setItem(this.#key, JSON.stringify(timer));
  }

  delete(): void {
    this.current = null;
    localStorage.removeItem(this.#key);
  }
}

const timer = new Timer();
export default timer;
