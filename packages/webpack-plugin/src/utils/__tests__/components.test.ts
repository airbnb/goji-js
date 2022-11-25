import { unstable_SimplifyComponent as SimplifyComponent } from '@goji/core';
import { getSimplifiedComponents, getUsedComponents } from '../components';
import { getBuiltInComponents } from '../../constants/components';

const COMPONENT_WHITELIST = ['view', 'button', 'text', 'invalid-component'];
const builtInComponents = getBuiltInComponents('wechat');

describe('getUsedComponents', () => {
  test('getUsedComponents works', () => {
    const whitelistedComponents = getUsedComponents('wechat', COMPONENT_WHITELIST);
    expect(whitelistedComponents).toHaveLength(3);
    expect(whitelistedComponents.map(_ => _.name).sort()).toEqual(['button', 'text', 'view']);
  });
});

describe('getSimplifiedComponents', () => {
  const simplifyComponents: Array<SimplifyComponent> = [
    {
      name: 'view',
      properties: ['hover-class'],
      events: [],
    },
    {
      name: 'view',
      properties: ['hover-class'],
      events: ['click'],
    },
  ];

  test('getSimplifiedComponents works', () => {
    const simplifiedComponents = getSimplifiedComponents(builtInComponents, simplifyComponents);
    expect(simplifiedComponents).toHaveLength(2);

    expect(simplifiedComponents[0].name).toBe('view');
    expect(simplifiedComponents[0].simplifiedId).toBe(0);
    expect(simplifiedComponents[0].props['hover-class']).not.toBeUndefined();
    expect(simplifiedComponents[0].events).toEqual([]);

    expect(simplifiedComponents[1].name).toBe('view');
    expect(simplifiedComponents[1].simplifiedId).toBe(1);
    expect(simplifiedComponents[1].props['hover-class']).not.toBeUndefined();
    expect(simplifiedComponents[1].events).toEqual(['click']);
  });
});
