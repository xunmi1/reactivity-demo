import { Dep, track, trigger } from './effect';
import { toReactive } from './reactive';
import { hasChanged } from './shared';

export interface Ref<T> {
  value: T;
}

class RefImpl<T> implements Ref<T> {
  #value: T;

  public dep?: Dep;

  constructor(value: T) {
    this.#value = toReactive(value);
  }

  get value() {
    trackRef(this);
    return this.#value;
  }

  set value(newVal) {
    if (hasChanged(newVal, this.#value)) {
      this.#value = toReactive(newVal);
      triggerRef(this);
    }
  }
}

export const trackRef = <T>(target: Ref<T>) => {
  track(target, 'value');
};

export const triggerRef = <T>(target: Ref<T>) => {
  trigger(target, 'value');
};

export function ref<T>(value: T): Ref<T>;
export function ref(): Ref<undefined>;
export function ref<T = any>(value?: T) {
  return new RefImpl(value);
}
export function isRef<T>(value: Ref<T> | unknown): value is Ref<T> {
  return value instanceof RefImpl;
}
