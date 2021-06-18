import { ComponentRenderData } from '../../../utils/components';
import {
  componentAttribute,
  componentProps,
  getComponentTagName,
  getConditionFromSidOrName,
} from '../components.wxml';

describe('getConditionFromSidOrName', () => {
  test('only name', () => {
    expect(getConditionFromSidOrName({ name: 'view' })).toBe(`type === 'view'`);
  });

  test('has simplify id', () => {
    expect(getConditionFromSidOrName({ name: 'view', sid: 100 })).toBe('sid === 100');
  });
});

describe('getComponentTagName', () => {
  test('simple component', () => {
    expect(getComponentTagName({ name: 'view' })).toBe('view');
  });

  test('wrapped component', () => {
    expect(getComponentTagName({ name: 'view', isWrapped: true })).toBe('goji-view');
  });
});

describe('componentAttribute', () => {
  test('no fallback', () => {
    expect(componentAttribute({ name: 'class', value: 'className' })).toBe(
      'class="{{props.className}}"',
    );
  });

  test('string fallback', () => {
    expect(componentAttribute({ name: 'class', value: 'className', fallback: 'default' })).toBe(
      `class="{{props.className || 'default'}}"`,
    );
  });

  test('number fallback', () => {
    expect(componentAttribute({ name: 'class', value: 'className', fallback: 123 })).toBe(
      `class="{{props.className === undefined ? 123 : props.className }}"`,
    );
  });

  test('boolean fallback', () => {
    expect(componentAttribute({ name: 'class', value: 'className', fallback: true })).toBe(
      `class="{{props.className === undefined ? true : props.className }}"`,
    );
  });
});

describe('componentProps', () => {
  test('simple component', () => {
    const component: ComponentRenderData = {
      name: 'view',
      events: [],
      attributes: [],
    };

    expect(componentProps({ component })).toEqual(
      expect.arrayContaining([
        'data-goji-id="{{id || -1}}"',
        'class="{{props.className}}"',
        'id="{{props.id}}"',
        `style="{{props.style || ''}}"`,
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

    expect(componentProps({ component })).toEqual(
      expect.arrayContaining([
        'nodes="{{c}}"',
        'goji-id="{{id || -1}}"',
        'class-name="{{props.className}}"',
        'the-id="{{props.id}}"',
        `the-style="{{props.style || ''}}"`,
      ]),
    );
  });

  test('events', () => {
    const component: ComponentRenderData = {
      name: 'view',
      events: ['tap', 'change'],
      attributes: [],
    };

    expect(componentProps({ component })).toEqual(
      expect.arrayContaining(['tap="e"', 'change="e"']),
    );
  });

  test('events in wrapped component', () => {
    const component: ComponentRenderData = {
      name: 'view',
      isWrapped: true,
      events: ['tap', 'change'],
      attributes: [],
    };

    expect(componentProps({ component })).not.toEqual(
      expect.arrayContaining(['tap="e"', 'change="e"']),
    );
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

    expect(componentProps({ component })).toEqual(
      expect.arrayContaining([
        'scale-min="{{props.scaleMin}}"',
        'scale-max="{{props.scaleMax === undefined ? 100 : props.scaleMax }}"',
      ]),
    );
  });
});
