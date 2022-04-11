import { track, trigger } from './effect';

export const reactive = <T extends object>(data: T) => {
  return new Proxy(data, {
    get(target, key, receiver) {
      track(target, key);
      return Reflect.get(target, key, receiver);
    },

    set(target, key, value, receiver) {
      const oldValue = Reflect.get(target, key);
      const result = Reflect.set(target, key, value, receiver);
      if (!Object.is(value, oldValue)) {
        trigger(target, key);
      }
      return result;
    },
  });
};
