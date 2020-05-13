import { shallowEqual } from '../shallowEqual';

describe('shallowEqual', () => {
  test('works for object', () => {
    expect(shallowEqual(NaN, NaN)).toBe(true);
    expect(shallowEqual(0, -0)).toBe(false);
    expect(shallowEqual({ a: 1 }, { a: 1 })).toBe(true);
    expect(shallowEqual({ a: 1 }, { a: 1, b: 2 })).toBe(false);
  });

  test('works for array', () => {
    expect(shallowEqual([], [])).toBe(true);
    expect(shallowEqual([1], [1])).toBe(true);
    const obj = {};
    expect(shallowEqual([obj], [obj])).toBe(true);
    expect(shallowEqual([NaN], [NaN])).toBe(true);
  });

  test('works for different type', () => {
    expect(shallowEqual(['a', 'b', 'c'], { 0: 'a', 1: 'b', 2: 'c' })).toBe(false);
  });
});
