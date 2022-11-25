import { renderTemplate } from '../..';
import { AllComponentDesc } from '../../../utils/components';
import { componentAttribute, componentAttributes } from '../components.wxml';

describe('componentAttribute', () => {
  test('no fallback', () => {
    expect(
      renderTemplate({ target: 'wechat', nodeEnv: 'development' }, () =>
        componentAttribute({ name: 'class', value: 'className' }),
      ),
    ).toBe('class="{{meta.props.className}}"');
  });

  test('string fallback', () => {
    expect(
      renderTemplate({ target: 'wechat', nodeEnv: 'development' }, () =>
        componentAttribute({ name: 'class', value: 'className', fallback: 'default' }),
      ),
    ).toBe(`class="{{meta.props.className || 'default'}}"`);
  });

  test('number fallback', () => {
    expect(
      renderTemplate({ target: 'wechat', nodeEnv: 'development' }, () =>
        componentAttribute({ name: 'class', value: 'className', fallback: 123 }),
      ),
    ).toBe(`class="{{meta.props.className === undefined ? 123 : meta.props.className }}"`);
  });

  test('boolean fallback', () => {
    expect(
      renderTemplate({ target: 'wechat', nodeEnv: 'development' }, () =>
        componentAttribute({ name: 'class', value: 'className', fallback: true }),
      ),
    ).toBe(`class="{{meta.props.className === undefined ? true : meta.props.className }}"`);
  });
});

describe('componentAttributes', () => {
  test('simple component', () => {
    const component: AllComponentDesc = {
      name: 'view',
      events: [],
      props: {},
    };

    expect(componentAttributes({ component })).toEqual(
      expect.arrayContaining([
        'data-goji-id="{{meta.gojiId || -1}}"',
        'class="{{meta.props.className}}"',
        'id="{{meta.props.id}}"',
        `style="{{meta.props.style || ''}}"`,
      ]),
    );
  });

  test('wrapped component', () => {
    const component: AllComponentDesc = {
      name: 'view',
      isWrapped: true,
      events: [],
      props: {},
    };

    expect(
      renderTemplate({ target: 'wechat', nodeEnv: 'development' }, () =>
        componentAttributes({ component }),
      ),
    ).toEqual(expect.arrayContaining(['meta="{{meta}}"']));
  });

  test('events', () => {
    const component: AllComponentDesc = {
      name: 'view',
      events: ['tap', 'change'],
      props: {},
    };

    expect(
      renderTemplate({ target: 'wechat', nodeEnv: 'development' }, () =>
        componentAttributes({ component }),
      ),
    ).toEqual(expect.arrayContaining(['bindtap="e"', 'bindchange="e"']));

    expect(
      renderTemplate({ target: 'alipay', nodeEnv: 'development' }, () =>
        componentAttributes({ component }),
      ),
    ).toEqual(expect.arrayContaining(['onTap="e"', 'onChange="e"']));
  });

  test('events in wrapped component', () => {
    const component: AllComponentDesc = {
      name: 'view',
      isWrapped: true,
      events: ['tap', 'change'],
      props: {},
    };

    expect(
      renderTemplate({ target: 'wechat', nodeEnv: 'development' }, () =>
        componentAttributes({ component }),
      ),
    ).not.toEqual(expect.arrayContaining(['tap="e"', 'change="e"']));
  });

  test('attributes', () => {
    const component: AllComponentDesc = {
      name: 'view',
      events: [],

      props: {
        'scale-min': {
          type: 'String',
        },
        'scale-max': {
          type: 'Number',
          defaultValue: 100,
        },
      },
    };

    expect(
      renderTemplate({ target: 'wechat', nodeEnv: 'development' }, () =>
        componentAttributes({ component }),
      ),
    ).toEqual(
      expect.arrayContaining([
        'scale-min="{{meta.props.scaleMin}}"',
        'scale-max="{{meta.props.scaleMax === undefined ? 100 : meta.props.scaleMax }}"',
      ]),
    );
  });
});
