import { afterEach, beforeEach } from 'mocha';
import shallowWithEffects from './core'

const { beforeEach, afterEach } = (global as any)
if (beforeEach === undefined || afterEach === undefined) throw new Error('Need to have beforeEach and afterEach in global context to use shallow-with-effects')

export default shallowWithEffects({ setup: beforeEach, teardown: afterEach });
