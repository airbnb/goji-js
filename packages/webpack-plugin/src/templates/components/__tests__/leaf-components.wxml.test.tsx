import { renderTemplate } from '../..';
import { ComponentDesc } from '../../../constants/components';
import { componentWxml } from '../components.wxml';

describe('useInlineLeafComponents', () => {
  const components: Array<ComponentDesc> = [
    {
      name: 'view',
      events: [],
      props: {},
    },
    {
      name: 'input',
      events: [],
      props: {},
      isLeaf: true,
    },
  ];
  const componentWxmlCommonOptions = {
    componentDepth: 0,
    childrenDepth: 1,
    useFlattenSwiper: false,
    components,
    simplifiedComponents: [],
    pluginComponents: [],
  };

  const TEMPLATE_INCLUDE_LEAF_COMPONENTS = `<include src="./leaf-components.wxml" />`;
  const TEMPLATE_INPUT_ITEM = `<block wx:elif="{{meta.type === 'input'}}">`;

  test('should not inline on wechat', () => {
    const result = renderTemplate({ target: 'wechat', nodeEnv: 'development' }, () =>
      componentWxml({ ...componentWxmlCommonOptions, useInlineLeafComponents: false }),
    );
    expect(result).toContain(TEMPLATE_INCLUDE_LEAF_COMPONENTS);
    expect(result).not.toContain(TEMPLATE_INPUT_ITEM);
  });

  test('should inline on alipay', () => {
    const result = renderTemplate({ target: 'alipay', nodeEnv: 'development' }, () =>
      componentWxml({ ...componentWxmlCommonOptions, useInlineLeafComponents: true }),
    );
    expect(result).not.toContain(TEMPLATE_INCLUDE_LEAF_COMPONENTS);
    expect(result).toContain(TEMPLATE_INPUT_ITEM);
  });
});
