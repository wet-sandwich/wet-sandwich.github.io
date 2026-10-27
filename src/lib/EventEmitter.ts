type EventMap = Record<string, unknown>;

type Listeners<T extends EventMap> = {
  [K in keyof T]?: Set<(data: T[K]) => void>;
};

export class EventEmitter<T extends EventMap> {
  private listeners: Listeners<T> = {};

  public on<K extends keyof T>(event: K, callback: (data: T[K]) => void): () => void {
    (this.listeners[event] ??= new Set()).add(callback);
    return () => this.off(event, callback);
  }

  public off<K extends keyof T>(event: K, callback: (data: T[K]) => void): void {
    this.listeners[event]?.delete(callback);
  }

  public emit<K extends keyof T>(event: K, data: T[K]): void {
    this.listeners[event]?.forEach((callback) => {
      callback(data);
    });
  }
}
