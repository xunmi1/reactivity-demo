import { track, trigger } from './effect';

export const reactive = <T extends object>(data: T) => {
  return new Proxy(data, {
    get(target, key) {
      track(target, key);
      return Reflect.get(target, key);
    },

    set(target, key, value) {
      const oldValue = Reflect.get(target, key);
      const result = Reflect.set(target, key, value);
      if (!Object.is(value, oldValue)) {
        trigger(target, key);
      }
      return result;
    },
  });
};
