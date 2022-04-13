import { track, trigger } from './effect';
import { hasChanged, isObject } from './shared';

const REACTIVE_FLAG = Symbol('isReactive');

export const reactive = <T extends object>(data: T) => {
  return new Proxy(data, {
    get(target, key, receiver) {
      if (key === REACTIVE_FLAG) return true;
      track(target, key);
      return Reflect.get(target, key, receiver);
    },

    set(target, key, value, receiver) {
      const oldValue = Reflect.get(target, key);
      const result = Reflect.set(target, key, value, receiver);
      if (hasChanged(value, oldValue)) {
        trigger(target, key);
      }
      return result;
    },
  });
};

export const toReactive = <T extends unknown>(value: T): T => (isObject(value) ? reactive(value) : value);

export const isReactive = (value: any) => !!value?.[REACTIVE_FLAG];
