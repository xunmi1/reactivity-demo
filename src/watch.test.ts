import { expect, it, vi } from 'vitest';
import { reactive, watch } from './';

it(`watch`, () => {
  const target = reactive({ a: 1 });
  const mock = vi.fn((_: unknown, __: unknown) => {});
  watch(() => target.a, mock);
  target.a = 2;
  expect(mock).toHaveBeenCalledTimes(1);
  expect(mock).toHaveBeenLastCalledWith(2, 1);
});

it('watch (immediate)', () => {
  const target = reactive({ a: 1 });
  const mock = vi.fn((_: unknown, __: unknown) => {});
  watch(() => target.a, mock, { immediate: true });
  expect(mock).toHaveBeenLastCalledWith(1, undefined);
  target.a = 2;
  expect(mock).toHaveBeenCalledTimes(2);
  expect(mock).toHaveBeenLastCalledWith(2, 1);
});

it('stop watch', () => {
  const target = reactive({ a: 1 });
  const mock = vi.fn((_: unknown, __: unknown) => {});
  const stop = watch(() => target.a, mock);
  stop();
  target.a = 2;
  expect(mock).not.toHaveBeenCalled();
  target.a = 3;
  expect(mock).not.toHaveBeenCalled();
});

it('stop watch (immediate)', () => {
  const target = reactive({ a: 1 });
  const mock = vi.fn((_: unknown, __: unknown) => {});
  const stop = watch(() => target.a, mock, { immediate: true });
  stop();
  expect(mock).toHaveBeenCalledTimes(1);
  target.a = 2;
  expect(mock).toHaveBeenCalledTimes(1);
});
