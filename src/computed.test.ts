import { expect, it } from 'vitest';
import { computed } from './computed';
import { reactive } from './reactive';

it(`computed`, () => {
  const target = reactive({ a: 1 });
  const a = computed(() => target.a);
  expect(a.value).toBe(1);
  target.a = 2;
  expect(a.value).toBe(2);
});
