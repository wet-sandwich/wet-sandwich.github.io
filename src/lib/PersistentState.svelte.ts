import { browser } from "$app/env";

export default class PersistentState<T> {
  #key: string;
  #value = $state() as T;

  constructor(key: string, initialValue: T) {
    this.#key = key;
    if (browser) {
      const item = localStorage.getItem(this.#key);
      this.#value = item ? JSON.parse(item) : initialValue;
    } else {
      this.#value = initialValue;
    }
  }

  get value(): T {
    return this.#value;
  }

  set value(newValue: T) {
    this.#value = newValue;
    if (browser) {
      localStorage.setItem(this.#key, JSON.stringify(newValue));
    }
  }
}
