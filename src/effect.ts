type Dep = Set<ReactiveEffect>;
const targetMap = new WeakMap<object, Map<string | symbol, Dep>>();
let activeEffect: ReactiveEffect | undefined;
const effectStack: ReactiveEffect[] = [];

export type EffectScheduler = (effect: ReactiveEffect) => void;

export interface ReactiveEffectOptions {
  scheduler?: EffectScheduler;
}

export class ReactiveEffect<T = unknown> {
  /** 关联的依赖集合 */
  deps: Dep[] = [];

  constructor(public fn: () => T, public options?: ReactiveEffectOptions) {}

  get scheduler() {
    return this.options?.scheduler;
  }

  run() {
    this.cleanup();
    try {
      activeEffect = this;
      effectStack.push(activeEffect);
      return this.fn();
    } finally {
      effectStack.pop();
      activeEffect = effectStack.at(-1);
    }
  }

  cleanup() {
    this.deps.forEach(dep => dep.delete(this));
    this.deps = [];
  }
}

export const effect = <T = unknown>(fn: () => T, options?: ReactiveEffectOptions) => {
  const effectFn = new ReactiveEffect(fn, options);
  return effectFn.run();
};

export const track = (target: object, key: string | symbol) => {
  if (!activeEffect) return;
  let depsMap = targetMap.get(target);
  if (!depsMap) targetMap.set(target, (depsMap = new Map()));
  let dep = depsMap.get(key);
  if (!dep) depsMap.set(key, (dep = new Set()));
  dep.add(activeEffect);
  activeEffect.deps.push(dep);
};

export const trigger = (target: object, key: string | symbol) => {
  const dep = targetMap.get(target)?.get(key) ?? [];
  [...dep]
    .filter(effect => effect !== activeEffect)
    .forEach(effect => (effect.scheduler ? effect.scheduler(effect) : effect.run()));
};
