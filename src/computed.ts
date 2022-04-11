import { ReactiveEffect } from './effect';
import { Ref, trackRef, triggerRef } from './ref';

class ComputedRef<T> implements Ref<T> {
  #dirty = true;
  #value: T;
  #effect: ReactiveEffect<T>;

  constructor(getter: () => T) {
    this.#effect = new ReactiveEffect(getter, {
      scheduler: () => {
        if (!this.#dirty) {
          this.#dirty = true;
          triggerRef(this);
        }
      },
    });
  }

  get value() {
    if (this.#dirty) this.#value = this.#effect.run();
    this.#dirty = false;
    trackRef(this);
    return this.#value;
  }
}

export const computed = <T>(getter: () => T) => {
  return new ComputedRef<T>(getter);
};
