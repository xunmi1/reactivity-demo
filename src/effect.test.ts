import { expect, it, vi } from 'vitest';
import { effect, reactive } from './';

it('单个 `effect`', () => {
  const target = reactive({ a: 1 });
  const mock = vi.fn(() => target.a);
  effect(mock);

  expect(mock).toHaveBeenCalledTimes(1);
  expect(mock).toHaveLastReturnedWith(1);
  target.a = 2;
  expect(mock).toHaveBeenCalledTimes(2);
  expect(mock).toHaveLastReturnedWith(2);
});

it('值未改变时不应该响应', () => {
  const target = reactive({ a: 1 });
  const mock = vi.fn(() => target.a);
  effect(mock);
  target.a = 1;
  expect(mock).toHaveBeenCalledTimes(1);
});

it('多个 `effect`', () => {
  const target = reactive({ a: 1 });
  const mock = vi.fn(() => target.a);
  effect(mock);
  effect(mock);
  expect(mock).toHaveBeenCalledTimes(2);
});

it('清理脏依赖', () => {
  const target = reactive({ a: true, b: 1 });
  const mock = vi.fn(() => target.a && target.b);
  effect(mock);
  expect(mock).toHaveBeenCalledTimes(1);
  target.a = false;
  expect(mock).toHaveBeenCalledTimes(2);
  target.b = 2;
  expect(mock).toHaveBeenCalledTimes(2);
  target.a = true;
  expect(mock).toHaveBeenCalledTimes(3);
  target.b = 3;
  expect(mock).toHaveBeenCalledTimes(4);
}, 100);

it('循环依赖', () => {
  const target = reactive({ a: 1 });
  const mock = vi.fn(() => (target.a += 1));
  effect(mock);
  expect(mock).toHaveBeenCalledTimes(1);
  target.a = 3;
  expect(mock).toHaveBeenCalledTimes(2);
});

it('嵌套 `effect`', () => {
  const origin = { a: 1, b: 1 };
  const target = reactive(origin);
  const mockNestEffectFn = vi.fn(() => target.b);
  const mockEffectFn = vi.fn(() => {
    effect(mockNestEffectFn);
    return target.a;
  });
  effect(mockEffectFn);

  expect(mockNestEffectFn).toHaveBeenCalledTimes(1);
  expect(mockEffectFn).toHaveBeenCalledTimes(1);
  target.a = 2;
  expect(mockNestEffectFn).toHaveBeenCalledTimes(2);
  expect(mockEffectFn).toHaveBeenCalledTimes(2);
  target.b = 2;
  // `target.a` 再次修改，导致 `target.b` 再次收集到 `mockNestEffectFn`, 因此会多执行一次
  expect(mockNestEffectFn).toHaveBeenCalledTimes(4);
  expect(mockEffectFn).toHaveBeenCalledTimes(2);
});

it('修改原始值, 不应该被观测', () => {
  const origin = { a: 1 };
  const target = reactive(origin);
  const mock = vi.fn(() => target.a);
  effect(mock);
  origin.a = 2;
  expect(mock).toHaveBeenCalledTimes(1);
  expect(target.a).toBe(2);
});

it('观测依赖 `this` 的 `getter`', () => {
  const target = reactive({
    a: 1,
    get b() {
      return this.a;
    },
  });
  const mock = vi.fn(() => target.b);
  effect(mock);
  expect(mock).toHaveLastReturnedWith(1);
  target.a += 1;
  expect(mock).toHaveLastReturnedWith(2);
});

it('观测依赖 `this` 的 `method`', () => {
  const target = reactive({
    a: 1,
    b() {
      return this.a;
    },
  });
  const mock = vi.fn(() => target.b());
  effect(mock);
  expect(mock).toHaveLastReturnedWith(1);
  target.a += 1;
  expect(mock).toHaveLastReturnedWith(2);
});
