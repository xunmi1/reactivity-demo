import { it, vi, expect } from 'vitest';
import { ref, effect } from './';

it('ref', () => {
  const a = ref(1);
  expect(a.value).toBe(1);
  a.value = 2;
  expect(a.value).toBe(2);
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
});

it('should make nested properties reactive', () => {
  const a = ref({ count: 1 });
  let dummy;
  effect(() => (dummy = a.value.count));
  expect(dummy).toBe(1);
  a.value.count = 2;
  expect(dummy).toBe(2);
});
