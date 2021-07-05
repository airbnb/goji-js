import { unstable_SimplifyComponent as SimplifyComponent, GojiTarget } from '@goji/core';
import {
  getSimplifiedComponents,
  getWhitelistedComponents,
  getRenderedComponents,
} from '../components';
import { getBuiltInComponents } from '../../constants/components';

const COMPONENT_WHITELIST = ['view', 'button', 'text', 'invalid-component'];
const builtInComponents = getBuiltInComponents('wechat');

describe('getWhitelistedComponents', () => {
  test('getWhitelistedComponents works', () => {
    const whitelistedComponents = getWhitelistedComponents('wechat', COMPONENT_WHITELIST);
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
    expect(simplifiedComponents[0].sid).toBe(0);
    expect(simplifiedComponents[0].props['hover-class']).not.toBeUndefined();
    expect(simplifiedComponents[0].events).toEqual([]);

    expect(simplifiedComponents[1].name).toBe('view');
    expect(simplifiedComponents[1].sid).toBe(1);
    expect(simplifiedComponents[1].props['hover-class']).not.toBeUndefined();
    expect(simplifiedComponents[1].events).toEqual(['click']);
  });
});

describe('getRenderedComponents', () => {
  test.each<[GojiTarget]>([['wechat'], ['baidu'], ['alipay']])(
    'getRenderedComponents works on %s',
    target => {
      const renderedComponents = getRenderedComponents(target, [], COMPONENT_WHITELIST);
      expect(renderedComponents).toHaveLength(3);
      for (const renderedComponent of renderedComponents) {
        for (const event of renderedComponent.events) {
          if (target === 'wechat' || target === 'baidu') {
            expect(event.startsWith('bind')).toBe(true);
            expect(event.includes('-')).toBe(false);
          } else if (target === 'alipay') {
            expect(event).toMatch(/^on[A-Z]/i);
          }
        }
      }
    },
  );

  test('getRenderedComponents works', () => {});
});
