import { Container } from '../../container';
import { verifyDiff, applyDiff } from '../diff';
import { TestingAdaptorInstance } from '../../__tests__/helpers/adaptor';

describe('verifyDiff', () => {
  const originalConsoleError = console.error;
  beforeEach(() => {
    console.error = jest.fn();
  });
  afterEach(() => {
    console.error = originalConsoleError;
  });

  it('warn if diff failed', () => {
    const mockContainer = new Container(new TestingAdaptorInstance());
    // init
    verifyDiff(mockContainer, { a: { b: { c: 1 } } }, {});
    expect(console.error).not.toBeCalled();
    // update
    verifyDiff(mockContainer, { a: { b: { c: 2 } } }, { 'a.b.d': 2 });
    expect(console.error).toBeCalled();
  });
});

describe('applyDiff', () => {
  test('works', () => {
    expect(applyDiff({}, { 'a.b.c': 1 })).toEqual({ a: { b: { c: 1 } } });
    expect(applyDiff({}, { 'a[1].b': 1 })).toEqual({ a: [undefined, { b: 1 }] });
    expect(applyDiff({}, { 'a.b': 1, 'c.d': 2 })).toEqual({ a: { b: 1 }, c: { d: 2 } });
  });
});
