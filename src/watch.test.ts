import { expect, it, vi } from 'vitest';
import { watch } from './watch';
import { reactive } from './reactive';

it(`watch`, () => {
  const target = reactive({ a: 1 });
  const mock = vi.fn((_: unknown, __: unknown) => {});
  watch(() => target.a, mock);
  target.a = 2;
  expect(mock).toHaveBeenCalledTimes(1);
  expect(mock).toHaveBeenCalledWith(2, 1);
});

it('immediate watch', () => {
  const target = reactive({ a: 1 });
  const mock = vi.fn((_: unknown, __: unknown) => {});
  watch(() => target.a, mock, { immediate: true });
  expect(mock).toHaveBeenCalledWith(1, undefined);
  target.a = 2;
  expect(mock).toHaveBeenCalledTimes(2);
  expect(mock).toHaveBeenCalledWith(2, 1);
});
