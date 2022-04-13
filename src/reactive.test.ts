import { expect, it } from 'vitest';
import { reactive, isReactive } from './';

it('reactive', () => {
  const origin = { foo: 1 };
  const observed = reactive(origin);
  expect(observed).not.toBe(origin);
  expect(isReactive(origin)).toBe(false);
  expect(isReactive(observed)).toBe(true);
});

it('observing already observed value should return same Proxy', () => {
  const original = { foo: 1 };
  const observed = reactive(original);
  const observed2 = reactive(observed);
  expect(observed2).toBe(observed);
});

it('observing the same value multiple times should return same Proxy', () => {
  const original = { foo: 1 };
  const observed = reactive(original);
  const observed2 = reactive(original);
  expect(observed2).toBe(observed);
});
