import { it, vi, expect } from 'vitest';
import { ref, isRef, effect } from './';
import { isReactive } from './reactive';

it('ref', () => {
  const origin = { foo: 1 };
  const originRef = ref(origin);
  expect(originRef.value).toStrictEqual(origin);
  originRef.value.foo = 2;
  expect(originRef.value).toStrictEqual(origin);
  expect(isRef(origin)).toBe(false);
  expect(isRef(originRef)).toBe(true);
  expect(isReactive(originRef.value)).toBe(true);
});

it('should be reactive', () => {
  const target = ref(1);
  const mock = vi.fn(() => target.value);
  effect(mock);

  expect(mock).toHaveBeenCalledTimes(1);
  expect(mock).toHaveLastReturnedWith(1);
  target.value = 2;
  expect(mock).toHaveBeenCalledTimes(2);
  expect(mock).toHaveLastReturnedWith(2);
  target.value = 2;
  expect(mock).toHaveBeenCalledTimes(2);
  expect(mock).toHaveLastReturnedWith(2);
});

it('should make nested properties reactive', () => {
  const a = ref({ count: 1 });
  let dummy;
  effect(() => (dummy = a.value.count));
  expect(dummy).toBe(1);
  a.value.count = 2;
  expect(dummy).toBe(2);
});

it('should unwrap nested ref', () => {
  expect(ref(ref(0)).value).toBe(0);
  const origin = { foo: 1 };
  expect(ref(ref(origin)).value).toStrictEqual(origin);
});
