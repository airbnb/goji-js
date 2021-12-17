import { kebabCase } from 'lodash';
import { GojiTarget } from '@goji/core';
import { getBuiltInComponents } from '../components';

const builtInComponents = getBuiltInComponents('wechat');

describe('components', () => {
  describe('getBuiltInComponents', () => {
    it('is an array', () => {
      expect(builtInComponents).toBeInstanceOf(Array);
    });

    it('has a definite list of built-in tags', () => {
      expect(
        builtInComponents.map(({ name }) => name).sort((a, b) => a.localeCompare(b)),
      ).toStrictEqual([
        'ad',
        'audio',
        'button',
        'camera',
        'canvas',
        'checkbox',
        'checkbox-group',
        'cover-image',
        'cover-view',
        'editor',
        'form',
        'functional-page-navigator',
        'icon',
        'image',
        'input',
        'label',
        'live-player',
        'live-pusher',
        'map',
        'movable-area',
        'movable-view',
        'navigator',
        'official-account',
        'open-data',
        'picker',
        'picker-view',
        'picker-view-column',
        'progress',
        'radio',
        'radio-group',
        'rich-text',
        'scroll-view',
        'slider',
        'swiper',
        'swiper-item',
        'switch',
        'text',
        'textarea',
        'video',
        'view',
        'web-view',
      ]);
    });

    const formatWeChatStyleEventName = (names: Array<string>) =>
      names.map(name => name.replace(/-/g, ''));

    const uniqNames = (names: Array<string>) => [...new Set(names)];

    it('disallow `longtap` event name', () => {
      for (const builtInComponent of builtInComponents) {
        expect(formatWeChatStyleEventName(builtInComponent.events).includes('longtap')).toBe(false);
      }
    });

    test.each<[GojiTarget]>([['wechat'], ['baidu'], ['alipay']])(
      'props name should be kebab-case on %s',
      target => {
        for (const builtInComponent of getBuiltInComponents(target)) {
          for (const propName of Object.keys(builtInComponent.props)) {
            // skip these tests
            if (builtInComponent.name === 'map' && propName === 'enable-3D') {
              continue;
            }
            // alipay must use `enableNative` not `enable-native`
            if (
              target === 'alipay' &&
              builtInComponent.name === 'input' &&
              propName === 'enableNative'
            ) {
              continue;
            }
            expect(kebabCase(propName)).toBe(propName);
          }
        }
      },
    );

    it('events name should not duplicate', () => {
      for (const builtInComponent of builtInComponents) {
        expect(formatWeChatStyleEventName(builtInComponent.events).sort()).toEqual(
          uniqNames(formatWeChatStyleEventName(builtInComponent.events).sort()),
        );
      }
    });
  });
});
