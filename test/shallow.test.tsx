import React, { useEffect, useState } from 'react';
import { beforeEach, describe, it } from 'mocha';
import { expect } from 'chai';
import { configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import shallowWithEffects from '../src'
import { ShallowRenderer } from '../src/core';

// enzyme setup
configure({ adapter: new Adapter() });

shallowWithEffects(shallow => {
  describe('Component with effect', () => {
    let mounted: boolean
    let unmounted: boolean
    let rendered: ReturnType<ShallowRenderer> = null

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

    beforeEach(() => {
      mounted = false;
      unmounted = false;

      rendered = shallow(
        <MountTracker
          onMount={() => {
            mounted = true;
          }}
          onUnmount={() => {
            unmounted = true;
          }}
        />
      );
    });


    it('invokes effect upon shallow render', () => {
      expect(mounted).to.eq(true);
      expect(unmounted).to.eq(false);
    });

    it('cleans up effect upon unmount', () => {
      rendered.unmount();
      expect(mounted).to.eq(true);
      expect(unmounted).to.eq(true);
    });

    it('does not invoke effect with empty dep array upon update', () => {
      let mounted = false;
      rendered.update()
      expect(mounted).to.eq(false);
    });

  });

  describe('Effect with dependency on state', () => {
    const Counter = (props: {
      onCountChange: (count: number) => void;
    }) => {
      const [count, setCount] = useState(0)
      useEffect(() => {
        props.onCountChange(count)
      }, [count]);

      return <div><button type="button" onClick={() => setCount(count+1)}></button></div>
    };

    let rendered: ReturnType<ShallowRenderer> = null
    let lastCount: number

    beforeEach(() => {
      lastCount = -1
      rendered = shallow(
        <Counter
          onCountChange={val => { lastCount = val }}
        />
      );
    })

    it('invokes effect on initial render', () => {
      expect(lastCount).to.eq(0);
    });

    it('invokes effect when dependency changes', () => {
      rendered.find('button').simulate('click')
      expect(lastCount).to.eq(1);
    });

    it('does not invoke effect when dependency does not change', () => {
      lastCount = -1
      rendered.update()
      expect(lastCount).to.eq(-1);
    });
  });
});
