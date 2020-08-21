import React, { useEffect } from 'react';
import { configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

// enzyme setup
configure({ adapter: new Adapter() });

// in your code, import like this:
import shallowWithEffects from '../src';

// wrap your tests, and use the provided shallow function instead of importing from enzyme
shallowWithEffects(shallow => {
  describe('Component with an effect', () => {

    // This test component invokes its onMount prop in an effect when first rendered,
    // and invokes onUnmount as cleanup when it is unmounted.
    const MountTracker = (props: {
      onMount: Function;
      onUnmount: Function;
    }) => {
      useEffect(() => {
        props.onMount();
        return () => props.onUnmount();
      }, []);

      return <div />;
    };

    it('invokes and cleans up effects', () => {
      let mounted = false;
      let unmounted = false;

      const rendered = shallow(
        <MountTracker
          onMount={() => {
            mounted = true;
          }}
          onUnmount={() => {
            unmounted = true;
          }}
        />
      );

      expect(mounted).toEqual(true);
      expect(unmounted).toEqual(false);

      rendered.unmount();

      expect(mounted).toEqual(true);
      expect(unmounted).toEqual(true);
    });
  });
});
