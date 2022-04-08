import { track, trigger } from './effect';
import { reactive } from './reactive';

export class Ref<T> {
  value: T;
}

export const trackRef = <T>(target: Ref<T>) => {
  track(target, 'value');
};

export const triggerRef = <T>(target: Ref<T>) => {
  trigger(target, 'value');
};

export function ref<T>(value: T): Ref<T>;
export function ref(): Ref<undefined>;
export function ref(value?: unknown) {
  return reactive({ value });
}
