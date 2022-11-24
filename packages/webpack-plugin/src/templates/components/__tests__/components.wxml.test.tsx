import { renderTemplate } from '../..';
import { ComponentRenderData } from '../../../utils/components';
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
    const component: ComponentRenderData = {
      name: 'view',
      events: [],
      attributes: [],
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
    const component: ComponentRenderData = {
      name: 'view',
      isWrapped: true,
      events: [],
      attributes: [],
    };

    expect(
      renderTemplate({ target: 'wechat', nodeEnv: 'development' }, () =>
        componentAttributes({ component }),
      ),
    ).toEqual(
      expect.arrayContaining([
        'nodes="{{meta.children}}"',
        'goji-id="{{meta.gojiId || -1}}"',
        'class-name="{{meta.props.className}}"',
        'the-id="{{meta.props.id}}"',
        `the-style="{{meta.props.style || ''}}"`,
      ]),
    );
  });

  test('events', () => {
    const component: ComponentRenderData = {
      name: 'view',
      events: ['tap', 'change'],
      attributes: [],
    };

    expect(
      renderTemplate({ target: 'wechat', nodeEnv: 'development' }, () =>
        componentAttributes({ component }),
      ),
    ).toEqual(expect.arrayContaining(['tap="e"', 'change="e"']));
  });

  test('events in wrapped component', () => {
    const component: ComponentRenderData = {
      name: 'view',
      isWrapped: true,
      events: ['tap', 'change'],
      attributes: [],
    };

    expect(
      renderTemplate({ target: 'wechat', nodeEnv: 'development' }, () =>
        componentAttributes({ component }),
      ),
    ).not.toEqual(expect.arrayContaining(['tap="e"', 'change="e"']));
  });

  test('attributes', () => {
    const component: ComponentRenderData = {
      name: 'view',
      events: [],
      attributes: [
        {
          name: 'scale-min',
          value: 'scaleMin',
        },
        {
          name: 'scale-max',
          value: 'scaleMax',
          fallback: 100,
        },
      ],
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
