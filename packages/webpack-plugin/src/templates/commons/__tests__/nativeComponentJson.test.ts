import { renderTemplate } from '../..';
import { ComponentDesc } from '../../../constants/components';
import { PluginComponentDesc } from '../../../utils/pluginComponent';
import { nativeComponentJson } from '../nativeComponentJson';

describe('nativeComponentJson', () => {
  const components: ComponentDesc[] = [
    {
      name: 'view',
      props: {
        x: {
          type: 'Number',
        },
        y: {
          type: 'Number',
        },
      },
      events: ['change', 'input'],
      isWrapped: true,
    },
  ];
  const pluginComponents: PluginComponentDesc[] = [
    {
      name: 'swan-sitemap-list',
      props: {
        x: {
          type: 'Number',
        },
        y: {
          type: 'Number',
        },
      },
      nativePath: 'dynamicLib://swan-sitemap-lib/swan-sitemap-list',
    },
  ];

  test('leaf component', () => {
    const json = JSON.parse(
      renderTemplate({ target: 'wechat', nodeEnv: 'development' }, () =>
        nativeComponentJson({
          isComponent: true,
          isLeaf: true,
          relativePathToBridge: '.',
          components,
          pluginComponents,
        }),
      ),
    );
    expect(json.usingComponents).toEqual({});
  });

  test('non-leaf component', () => {
    const json = JSON.parse(
      renderTemplate({ target: 'wechat', nodeEnv: 'development' }, () =>
        nativeComponentJson({
          isComponent: true,
          isLeaf: false,
          relativePathToBridge: '.',
          components,
          pluginComponents,
        }),
      ),
    );
    expect(json.usingComponents).not.toEqual({});
    expect(json.usingComponents['goji-view']).toBe('./components/view');
    expect(json.usingComponents['goji-subtree']).toBe('./subtree');
    expect(json.usingComponents['swan-sitemap-list']).toBe(
      'dynamicLib://swan-sitemap-lib/swan-sitemap-list',
    );
  });
});
