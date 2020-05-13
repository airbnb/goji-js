import { BUILD_IN_COMPONENTS } from '../components';

describe('components', () => {
  describe('BUILD_IN_COMPONENTS', () => {
    it('is an array', () => {
      expect(BUILD_IN_COMPONENTS).toBeInstanceOf(Array);
    });
    it('has a definite list of built-in tags', () => {
      expect(
        BUILD_IN_COMPONENTS.map(({ name }) => name).sort((a, b) => a.localeCompare(b)),
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
