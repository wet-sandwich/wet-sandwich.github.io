type EventMap = Record<string, any>;

export class EventEmitter<T extends EventMap> {
  private listeners = new Map<keyof T, Set<(data: any) => void>>();

  public on<K extends keyof T>(event: K, callback: (data: T[K]) => void): () => void {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }
    this.listeners.get(event)?.add(callback);
    return () => this.off(event, callback);
  }

  public off<K extends keyof T>(event: K, callback: (data: T[K]) => void): void {
    this.listeners.get(event)?.delete(callback);
  }

  public emit<K extends keyof T>(event: K, data: T[K]): void {
    this.listeners.get(event)?.forEach((callback) => {
      callback(data);
    });
  }
}
