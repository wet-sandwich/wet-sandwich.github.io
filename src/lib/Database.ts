import { EventEmitter } from "#lib/EventEmitter.ts";
import { getTime, startOfDay, endOfDay } from "date-fns";

export interface TimeEntry {
  id: string;
  task: string;
  project: string;
  start: number;
  end: number;
}

export interface Project {
  id: string;
  name: string;
  lastUsed: number;
}

type Store = "timers" | "projects";

type DBEvents = {
  addTimer: { item: TimeEntry };
  updateTimer: { item: TimeEntry }
  deleteTimer: { key: IDBValidKey };
  addProject: { item: Project };
  updateProject: { item: Project };
  deleteProject: { key: IDBValidKey };
}

function backfillProjects(tx: IDBTransaction) {
  const lastUsed = new Map<string, number>();
  const cursorRequest = tx.objectStore("timers").openCursor();
  cursorRequest.onsuccess = () => {
    const cursor = cursorRequest.result;
    if (cursor) {
      const { project, start } = cursor.value as TimeEntry;
      const name = project?.trim();
      if (name) lastUsed.set(name, Math.max(lastUsed.get(name) ?? 0, start));
      cursor.continue();
      return;
    }
    const projectStore = tx.objectStore("projects");
    const byName = projectStore.index("project");
    for (const [name, time] of lastUsed) {
      const existing = byName.getKey(name);
      existing.onsuccess = () => {
        if (existing.result === undefined) {
          projectStore.add({ id: crypto.randomUUID(), name, lastUsed: time });
        }
      };
    }
  };
}

export class Database extends EventEmitter<DBEvents> {
  #db: IDBDatabase | null = null;

  private openDB(): Promise<IDBDatabase> {
    return new Promise((resolve, reject) => {
      if (this.#db) return resolve(this.#db);

      const request = indexedDB.open("timeit-db", 4);

      request.onupgradeneeded = (event: IDBVersionChangeEvent) => {
        const db = request.result;
        const tx = request.transaction!;
        const { oldVersion } = event;

        if (oldVersion < 1) {
          const timerStore = db.createObjectStore("timers", { keyPath: "id" });
          timerStore.createIndex("project", "project", { unique: false });
          timerStore.createIndex("time", "start", { unique: true });
        }

        if (oldVersion < 2) {
          const timerStore = tx.objectStore("timers");
          timerStore.createIndex("task", "task", { unique: false });

          const projectStore = db.createObjectStore("projects", { keyPath: "id" });
          projectStore.createIndex("lastUsed", "lastUsed", { unique: false });
        }

        if (oldVersion < 3) {
          const projectStore = tx.objectStore("projects");
          projectStore.createIndex("project", "name", { unique: true });
          backfillProjects(tx);
        }

        if (oldVersion < 4) {
          const timerStore = tx.objectStore("timers");
          timerStore.createIndex("project_date", ["project", "start"]);
        }
      }

      request.onblocked = () => {
        console.warn("Database upgrade blocked: close other tabs of this app.");
      }

      request.onsuccess = (event: Event) => {
        const target = event.target as IDBOpenDBRequest;
        const db = target.result;
        db.onversionchange = () => {
          db.close();
          this.#db = null;
        };
        this.#db = db;
        resolve(db);
      }

      request.onerror = (event: Event) => {
        const target = event.target as IDBOpenDBRequest;
        reject(target.error);
      }
    });
  }

  private abortError(tx: IDBTransaction): DOMException {
    return tx.error ?? new DOMException("Transaction aborted", "AbortError");
  }

  private async add(store: Store, data: TimeEntry | Project): Promise<void> {
    const db = await this.openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(store, "readwrite");
      const request = tx.objectStore(store).add(data);
      tx.oncomplete = () => resolve();
      request.onerror = () => reject(request.error);
      tx.onabort = () => reject(this.abortError(tx));
    });
  }

  private async get(store: Store, id: IDBValidKey): Promise<TimeEntry | undefined> {
    const db = await this.openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(store, "readonly");
      const request = tx.objectStore(store).get(id);
      request.onsuccess = () => resolve(request.result as TimeEntry | undefined);
      request.onerror = () => reject(request.error);
      tx.onabort = () => reject(this.abortError(tx));
    });
  }

  private async put(store: Store, data: TimeEntry | Project): Promise<void> {
    const db = await this.openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(store, "readwrite");
      const request = tx.objectStore(store).put(data);
      tx.oncomplete = () => resolve();
      request.onerror = () => reject(request.error);
      tx.onabort = () => reject(this.abortError(tx));
    });
  }

  private async delete(store: Store, id: IDBValidKey): Promise<void> {
    const db = await this.openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(store, "readwrite");
      const request = tx.objectStore(store).delete(id);
      tx.oncomplete = () => resolve();
      request.onerror = () => reject(request.error);
      tx.onabort = () => reject(this.abortError(tx));
    });
  }

  async createTimer(entry: TimeEntry) {
    try {
      await this.add("timers", entry);
      this.emit("addTimer", { item: entry });
    } catch (error) {
      console.error(`Failed to create new timer ${entry.task}:`, error);
    }
  }

  async readTimer(id: string): Promise<TimeEntry | null> {
    try {
      return (await this.get("timers", id)) ?? null;
    } catch (error) {
      console.error(`Failed to get timer ${id}:`, error);
      return null;
    }
  }

  async updateTimer(entry: TimeEntry): Promise<void> {
    try {
      await this.put("timers", entry);
      this.emit("updateTimer", { item: entry });
      await this.touchProject(entry.project);
    } catch (error) {
      console.error(`Failed to update timer ${entry.task}:`, error);
    }
  }

  async deleteTimer(id: string): Promise<void> {
    try {
      await this.delete("timers", id);
      this.emit("deleteTimer", { key: id });
    } catch (error) {
      console.error(`Failed to delete timer ${id}:`, error);
    }
  }

  async getTimersBetween(start: number, end: number = Date.now()): Promise<TimeEntry[]> {
    const db = await this.openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction("timers", "readonly");
      const index = tx.objectStore("timers").index("time");

      const range = IDBKeyRange.bound(start, end);
      const request = index.openCursor(range, "prev");
      const results: TimeEntry[] = [];

      request.onsuccess = () => {
        const cursor = request.result;
        if (cursor) {
          results.push(cursor.value);
          cursor.continue();
        } else {
          resolve(results);
        }
      };
      request.onerror = () => reject(request.error);
    });
  }

  async getTimersBefore(before: number, limit: number): Promise<TimeEntry[]> {
    const db = await this.openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction("timers", "readonly");
      const range = IDBKeyRange.upperBound(before, true);
      const request = tx.objectStore("timers").index("time").openCursor(range, "prev");
      const results: TimeEntry[] = [];

      request.onsuccess = () => {
        const cursor = request.result;
        if (cursor && results.length < limit) {
          results.push(cursor.value);
          cursor.continue();
        } else {
          resolve(results);
        }
      };
      request.onerror = () => reject(request.error);
      tx.onabort = () => reject(this.abortError(tx));
    });
  }

  async searchTimers(project: string, begin: number, end: number): Promise<TimeEntry[]> {
    const db = await this.openDB();
    const lower = Number.isFinite(begin) ? getTime(startOfDay(begin)) : 0;
    const upper = Number.isFinite(end) ? getTime(endOfDay(end)) : Date.now();
    return new Promise((resolve, reject) => {
      const tx = db.transaction("timers", "readonly");
      const index = Boolean(project)
        ? tx.objectStore("timers").index("project_date")
        : tx.objectStore("timers").index("time");
      const range = Boolean(project)
        ? IDBKeyRange.bound([project, lower], [project, upper])
        : IDBKeyRange.bound(lower, upper);
      const request = index.openCursor(range, "prev");
      const results: TimeEntry[] = [];

      request.onsuccess = () => {
        const cursor = request.result;
        if (cursor) {
          results.push(cursor.value);
          cursor.continue();
        } else {
          resolve(results);
        }
      };
      request.onerror = () => reject(request.error);
      tx.onabort = () => reject(this.abortError(tx));
    });
  }

  async getProjects(): Promise<Project[]> {
    try {
      const db = await this.openDB();
      return await new Promise((resolve, reject) => {
        const tx = db.transaction("projects", "readonly");
        const request = tx.objectStore("projects").index("lastUsed").getAll();
        request.onsuccess = () => resolve((request.result as Project[]).reverse());
        request.onerror = () => reject(request.error);
        tx.onabort = () => reject(this.abortError(tx));
      });
    } catch (error) {
      console.error("Failed to get projects:", error);
      return [];
    }
  }

  async touchProject(name: string, time: number = Date.now()): Promise<void> {
    const trimmed = name.trim();
    if (!trimmed) return;
    try {
      const db = await this.openDB();
      const { project, isNew } = await new Promise<{ project: Project; isNew: boolean }>(
        (resolve, reject) => {
          const tx = db.transaction("projects", "readwrite");
          const store = tx.objectStore("projects");
          const lookup = store.index("project").get(trimmed);
          let result: { project: Project; isNew: boolean };
          lookup.onsuccess = () => {
            const existing = lookup.result as Project | undefined;
            const project = existing
              ? { ...existing, lastUsed: Math.max(existing.lastUsed, time) }
              : { id: crypto.randomUUID(), name: trimmed, lastUsed: time };
            store.put(project);
            result = { project, isNew: !existing };
          };
          lookup.onerror = () => reject(lookup.error);
          tx.oncomplete = () => resolve(result);
          tx.onabort = () => reject(this.abortError(tx));
        },
      );
      this.emit(isNew ? "addProject" : "updateProject", { item: project });
    } catch (error) {
      console.error(`Failed to save project ${trimmed}:`, error);
    }
  }
}

const database = new Database();
export default database
