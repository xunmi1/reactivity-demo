import { expect, it, vi } from 'vitest';
import { computed, reactive } from './';

it(`computed`, () => {
  const target = reactive({ a: 1 });
  const a = computed(() => target.a);
  expect(a.value).toBe(1);
  target.a = 2;
  expect(a.value).toBe(2);
});

it('惰性计算', () => {
  const target = reactive({ a: 1 });
  const mock = vi.fn(() => target.a);
  const a = computed(mock);
  target.a = 2;
  target.a = 3;
  a.value;
  expect(mock).toHaveBeenCalledTimes(1);
  target.a = 3;
  a.value;
  expect(mock).toHaveBeenCalledTimes(1);
});
