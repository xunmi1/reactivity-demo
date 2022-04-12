import { expect, it, vi } from 'vitest';
import { computed, effect, reactive } from './';

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

it('should trigger effect', () => {
  const target = reactive<{ foo?: number }>({});
  const computedValue = computed(() => target.foo);
  const mock = vi.fn(() => computedValue.value);
  effect(mock);
  expect(mock).toHaveLastReturnedWith(undefined);
  target.foo = 1;
  expect(mock).toBeCalledTimes(2);
  expect(mock).toHaveLastReturnedWith(1);
});

it('链式调用', () => {
  const value = reactive({ foo: 0 });
  const c1 = computed(() => value.foo);
  const c2 = computed(() => c1.value + 1);
  expect(c1.value).toBe(0);
  expect(c2.value).toBe(1);
  value.foo += 1;
  expect(c1.value).toBe(1);
  expect(c2.value).toBe(2);
});
