import React from 'react';
import { shallow } from 'enzyme';
import fakeEffect, { FakeEffect } from './fakeEffect';

export type ShallowRenderer = typeof shallow;

interface CachedHooks {
  useEffect: typeof React.useEffect;
  useLayoutEffect: typeof React.useLayoutEffect;
}

interface FakedHooks {
  useEffect: FakeEffect;
  useLayoutEffect: FakeEffect;
}

export interface TestLifecycleAdapter {
  setup: (fn: () => void) => void;
  teardown: (fn: () => void) => void;
}

const shallowEffects = (adapter: TestLifecycleAdapter) => (
  fn: (shallow: ShallowRenderer) => void
) => {
  let cache: CachedHooks;
  let fakes: FakedHooks;

  adapter.setup(() => {
    cache = {
      useEffect: React.useEffect,
      useLayoutEffect: React.useLayoutEffect,
    };

    fakes = {
      useEffect: fakeEffect(),
      useLayoutEffect: fakeEffect(),
    };

    React.useEffect = fakes.useEffect.invoke;
    React.useLayoutEffect = fakes.useLayoutEffect.invoke;
  });

  adapter.teardown(() => {
    React.useEffect = cache.useEffect;
    React.useLayoutEffect = cache.useLayoutEffect;
  });

  const cleanupEffects = () => {
    fakes.useEffect.cleanup();
    fakes.useLayoutEffect.cleanup();
  };

  const shallowWithEffects: ShallowRenderer = (node, options) => {
    const rendered = shallow(node, options);
    const originalUnmount = rendered.unmount.bind(rendered);
    rendered.unmount = () => {
      cleanupEffects();
      return originalUnmount();
    };
    return rendered;
  };

  fn(shallowWithEffects);
};

export default shallowEffects;
