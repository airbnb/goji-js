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
  });
});
