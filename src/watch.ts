import { ReactiveEffect } from './effect';
import { isRef, Ref } from './ref';
import { isArray, isFunction, isMap, isObject, isPlainObject, isSet } from './shared';

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

  stop() {
    this.#effect.stop();
  }
}

export const watch = <T>(source: T | Ref<T> | (() => T), callback: WatchCallback<T>, options?: WatchOptions) => {
  const getter = isFunction(source) ? source : () => traverse(isRef(source) ? source.value : source);
  const watcher = new Watcher(getter, callback, options);
  return () => watcher.stop();
};

export function traverse<T>(value: T, seen = new Set()): T {
  if (!isObject(value)) return value;
  if (seen.has(value)) return value;
  seen.add(value);
  if (isRef(value)) traverse(value.value, seen);
  else if (isArray(value)) value.forEach(v => traverse(v, seen));
  else if (isSet(value) || isMap(value)) value.forEach(v => traverse(v, seen));
  else if (isPlainObject(value)) {
    for (const key in value) {
      traverse((value as any)[key], seen);
    }
  }
  return value;
}
