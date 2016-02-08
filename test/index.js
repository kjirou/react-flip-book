import assert from 'assert';

import FlipBook, {
  alterTransition,
  generateTransition,
  totalDurations,
} from '../src';


describe('react-flip-book', () => {

  it('should export modules', () => {
    assert.strictEqual(typeof FlipBook, 'function');
    assert.strictEqual(typeof alterTransition, 'function');
    assert.strictEqual(typeof generateTransition, 'function');
    assert.strictEqual(typeof totalDurations, 'function');
  });
});
