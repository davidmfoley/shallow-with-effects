## shallow-with-effects

This is a small wrapper that allows unit-testing react components that use `useEffect` and `useLayoutEffect` using enzyme's [shallow](https://enzymejs.github.io/enzyme/docs/api/shallow.html) renderer.

It works by hooking into your test runner's lifecycle methods `beforeEach` and `afterEach`, and wrapping enzyne's `shallow` so that cleanup effects are handled upon unmount.

Out of the box support is provided for mocha and jest.

### Usage example

Let's say we have a component that fetches the current user information when it is mounted.

Here's how we could test that, using shallow-with-effects with jest:

```typescript
import React, { useEffect, useState } from 'react';
import shallowWithEffects from 'shallow-with-effects';
import { configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

configure({ adapter: new Adapter() });

// wrap your tests with shallowWithEffects
// it handles cleaning up after itself
shallowWithEffects(shallow => {
  describe('CurrentUser', () => {
    it('fetches the current user when mounted', () => {
      let fetched = false
      // use the `shallow` function that is passed in rather than the version exported from enzyme
      // this allows you to test unmounting
      const rendered = shallow(<CurrentUser fetchCurrentUser={() => { fetched = true } />)
      expect(fetched).toEqual(true)
    })
  });
});
```

### Thanks
Credit to mikeborozdin for the brilliant hack of using the effect function body as a key
https://github.com/mikeborozdin/jest-react-hooks-shallow/blob/master/src/mock-use-effect/mock-use-effect.ts
