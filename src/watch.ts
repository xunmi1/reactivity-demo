import { ReactiveEffect } from './effect';

interface WatchOptions {
  immediate?: boolean;
}

export type WatchCallback<Value> = (value: Value, oldValue?: Value) => void;

class Watcher<T> {
  #value: T;
  #oldValue: T;
  #effect: ReactiveEffect<T>;

  constructor(getter: () => T, public callback: WatchCallback<T>, public options?: WatchOptions) {
    this.#effect = new ReactiveEffect(getter, {
      scheduler: this.#scheduler.bind(this),
    });
    if (options?.immediate) {
      this.#scheduler();
    } else {
      this.#oldValue = this.#effect.run();
    }
  }

  #scheduler() {
    this.#value = this.#effect.run();
    this.callback(this.#value, this.#oldValue);
    this.#oldValue = this.#value;
  }
}

export const watch = <T>(getter: () => T, callback: WatchCallback<T>, options?: WatchOptions) => {
  new Watcher(getter, callback, options);
};
