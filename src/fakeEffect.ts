//
// credit to mikeborozdin for the smart hack of using the function body as map key here
// https://github.com/mikeborozdin/jest-react-hooks-shallow/blob/master/src/mock-use-effect/mock-use-effect.ts
//

export type FakeEffect = {
  implementation: (fn: () => void, deps?: any[]) => void;
  cleanup: () => void;
};

type EffectBody = () => void | (() => void);

interface EffectInstance {
  tryInvoke: (effect: EffectBody, dependencies: unknown[] | undefined) => void;
  cleanup: () => void;
}

const noOp = () => {};

const effectInstance = () => {
  let lastDependencies: unknown[] | undefined = undefined;
  let cleanupFn: () => void = () => {};

  return {
    tryInvoke: (fn: EffectBody, dependencies: undefined | unknown[]) => {
      if (
        lastDependencies &&
        !lastDependencies.some(
          (prevDep, index) => prevDep !== dependencies[index]
        )
      ) {
        return;
      }

      cleanupFn();

      cleanupFn = fn() || (() => {});
    },
    cleanup: () => cleanupFn(),
  };
};

const fakeUseEffect = (): FakeEffect => {
  const effectInstances: { [body: string]: EffectInstance } = {};

  const getEffectInstance = (effect: Function) => {
    const key = effect.toString();
    return (effectInstances[key] = effectInstances[key] || effectInstance());
  };

  return {
    implementation: (effect: EffectBody, dependencies?: unknown[]): void => {
      getEffectInstance(effect).tryInvoke(effect, dependencies);
    },

    cleanup: () => {
      Object.values(effectInstances).forEach((instance) => {
        instance.cleanup();
      });
    },
  };
};

export default fakeUseEffect;
