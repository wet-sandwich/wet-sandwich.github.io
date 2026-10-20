let db: IDBDatabase | null = null;

export interface TimeEntry {
  id: string;
  task: string;
  project: string;
  start: number;
  end: number;
}

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (db) resolve(db);

    const request = indexedDB.open("timeit-db", 1);

    request.onupgradeneeded = (_event: IDBVersionChangeEvent) => {
      const db = request.result;

      const timerStore = db.createObjectStore("timers", { keyPath: "id" });

      timerStore.createIndex("project", "project", { unique: false });
      timerStore.createIndex("time", "start", { unique: true });
    }

    request.onsuccess = (event: Event) => {
      const target = event.target as IDBOpenDBRequest;
      db = target.result;
      resolve(db);
    }

    request.onerror = (event: Event) => {
      const target = event.target as IDBOpenDBRequest;
      reject(target.error);
    }
  });
}

export async function createTimer(entry: TimeEntry): Promise<void> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction("timers", "readwrite");
    const store = tx.objectStore("timers");
    const request = store.add(entry);

    request.onsuccess = () => resolve();
    request.onerror = () => reject();
  });
}

export async function readTimer(id: string): Promise<TimeEntry> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction("timers", "readonly");
    const store = tx.objectStore("timers");
    const request = store.get(id);

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  })
}

export async function deleteTimer(id: string): Promise<void> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction("timers", "readwrite");
    const store = tx.objectStore("timers");
    const request = store.delete(id);

    request.onsuccess = () => resolve();
    request.onerror = () => reject();
  });
}

export async function getTimersBetween(start: number, end: number = Date.now()): Promise<TimeEntry[]> {
  const db = await openDB();
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
