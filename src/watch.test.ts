import { expect, it, vi } from 'vitest';
import { reactive, ref, watch, computed } from './';

it(`watch`, () => {
  const target = reactive({ a: 1 });
  const mock = vi.fn();
  watch(() => target.a, mock);
  target.a = 2;
  expect(mock).toHaveBeenCalledTimes(1);
  expect(mock).toHaveBeenLastCalledWith(2, 1);
});

it('watch (immediate)', () => {
  const target = reactive({ a: 1 });
  const mock = vi.fn();
  watch(() => target.a, mock, { immediate: true });
  expect(mock).toHaveBeenLastCalledWith(1, undefined);
  target.a = 2;
  expect(mock).toHaveBeenCalledTimes(2);
  expect(mock).toHaveBeenLastCalledWith(2, 1);
});

it('watch reactive', () => {
  const target = reactive({ a: 1 });
  const mock = vi.fn();
  watch(target, mock);
  target.a = 2;
  expect(mock).toHaveBeenCalledTimes(1);
  // 引用，新旧值相同
  expect(mock).toHaveBeenLastCalledWith({ a: 2 }, { a: 2 });
});

it('watch ref', () => {
  const target = ref(1);
  const mock = vi.fn();
  watch(target, mock);
  target.value = 2;
  expect(mock).toHaveBeenCalledTimes(1);
  expect(mock).toHaveBeenLastCalledWith(2, 1);
});

it('watch nested ref', () => {
  const target = ref([1]);
  const mock = vi.fn();
  watch(target, mock);
  target.value = [2];
  expect(mock).toHaveBeenCalledTimes(1);
  expect(mock).toHaveBeenLastCalledWith([2], [1]);
});

it('watch a computed value', () => {
  const target = reactive({ a: 1 });
  const computedValue = computed(() => target.a);
  const mock = vi.fn();
  watch(() => computedValue.value, mock);
  target.a = 2;
  expect(mock).toHaveBeenCalledTimes(1);
  expect(mock).toHaveBeenLastCalledWith(2, 1);
});

it('stop watch', () => {
  const target = reactive({ a: 1 });
  const mock = vi.fn();
  const stop = watch(() => target.a, mock);
  stop();
  target.a = 2;
  expect(mock).not.toHaveBeenCalled();
  stop();
  target.a += 1;
  expect(mock).not.toHaveBeenCalled();
});

it('stop watch (immediate)', () => {
  const target = reactive({ a: 1 });
  const mock = vi.fn();
  const stop = watch(() => target.a, mock, { immediate: true });
  stop();
  expect(mock).toHaveBeenCalledTimes(1);
  target.a = 2;
  expect(mock).toHaveBeenCalledTimes(1);
});

it('修改原始值, 不应该被 `watch`', () => {
  const origin = { a: 1 };
  const target = reactive(origin);
  const mock = vi.fn();
  watch(() => target.a, mock);
  origin.a = 2;
  expect(mock).not.toHaveBeenCalled();
  target.a = 3;
  expect(mock).toHaveBeenCalledTimes(1);
  expect(mock).toHaveBeenLastCalledWith(3, 1);
});
