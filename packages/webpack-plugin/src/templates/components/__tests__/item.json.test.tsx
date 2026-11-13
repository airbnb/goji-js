import { itemJson } from '../item.json';
import { renderTemplate } from '../..';
import { ComponentDesc } from '../../../constants/components';
import { PluginComponentDesc } from '../../../utils/pluginComponent';

describe('itemJson', () => {
  const components: ComponentDesc[] = [
    {
      name: 'view',
      props: {},
      events: [],
      isWrapped: true,
    },
  ];
  const pluginComponents: PluginComponentDesc[] = [];

  const render = (isComponent: boolean) =>
    JSON.parse(
      renderTemplate({ target: 'wechat', nodeEnv: 'production' }, () =>
        itemJson({
          relativePathToBridge: '../_goji_bridges',
          components,
          pluginComponents,
          isComponent,
        }),
      ),
    );

  test('page should not be a component', () => {
    const json = render(false);
    expect(json.component).toBeUndefined();
    expect(json.usingComponents['goji-view']).toBe('../_goji_bridges/components/view');
  });

  test('custom tabBar entry should be a component', () => {
    const json = render(true);
    expect(json.component).toBe(true);
    expect(json.usingComponents['goji-view']).toBe('../_goji_bridges/components/view');
  });
});
