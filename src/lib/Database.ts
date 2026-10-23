import { EventEmitter } from "#lib/EventEmitter.ts";

export interface TimeEntry {
  id: string;
  task: string;
  project: string;
  start: number;
  end: number;
}

type DBEvents = {
  add: { item: TimeEntry };
  delete: { key: IDBValidKey };
  update: { item: TimeEntry };
}

export class Database extends EventEmitter<DBEvents> {
  #db: IDBDatabase | null = null;

  private openDB(): Promise<IDBDatabase> {
    return new Promise((resolve, reject) => {
      if (this.#db) resolve(this.#db);

      const request = indexedDB.open("timeit-db", 1);

      request.onupgradeneeded = (_event: IDBVersionChangeEvent) => {
        const db = request.result;

        const timerStore = db.createObjectStore("timers", { keyPath: "id" });

        timerStore.createIndex("project", "project", { unique: false });
        timerStore.createIndex("time", "start", { unique: true });
      }

      request.onsuccess = (event: Event) => {
        const target = event.target as IDBOpenDBRequest;
        this.#db = target.result;
        resolve(this.#db);
      }

      request.onerror = (event: Event) => {
        const target = event.target as IDBOpenDBRequest;
        reject(target.error);
      }
    });
  }

  async createTimer(entry: TimeEntry): Promise<void> {
    const db = await this.openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction("timers", "readwrite");
      tx.objectStore("timers").add(entry);
      tx.oncomplete = () => {
        resolve();
        this.emit("add", { item: entry, })
      }
      tx.onerror = () => reject();
    });
  }

  async readTimer(id: string): Promise<TimeEntry> {
    const db = await this.openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction("timers", "readonly");
      const store = tx.objectStore("timers");
      const request = store.get(id);
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  async updateTimer(entry: TimeEntry): Promise<void> {
    const db = await this.openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction("timers", "readwrite");
      tx.objectStore("timers").put(entry);
      tx.oncomplete = () => {
        resolve();
        this.emit("update", { item: entry });
      }
      tx.onerror = () => reject();
    });
  }

  async deleteTimer(id: string): Promise<void> {
    const db = await this.openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction("timers", "readwrite");
      const store = tx.objectStore("timers");
      const request = store.delete(id);
      request.onsuccess = () => {
        resolve();
        this.emit("delete", { key: id });
      }
      request.onerror = () => reject();
    });
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
}

const database = new Database();
export default database
