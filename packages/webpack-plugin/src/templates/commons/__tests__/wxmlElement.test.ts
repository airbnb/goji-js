import { getComponentTagName, getConditionFromSidOrName } from '../wxmlElement';

describe('getConditionFromSidOrName', () => {
  test('only name', () => {
    expect(getConditionFromSidOrName({ name: 'view' })).toBe(`type === 'view'`);
  });

  test('has simplify id', () => {
    expect(getConditionFromSidOrName({ name: 'view', sid: 100 })).toBe('sid === 100');
  });
});

describe('getComponentTagName', () => {
  test('simple component', () => {
    expect(getComponentTagName({ name: 'view' })).toBe('view');
  });

  test('wrapped component', () => {
    expect(getComponentTagName({ name: 'view', isWrapped: true })).toBe('goji-view');
  });
});
