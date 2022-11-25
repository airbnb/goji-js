import { renderTemplate } from '../..';
import { t } from '../../helpers/t';
import {
  element,
  getComponentTagName,
  getConditionFromSidOrName,
  getEventName,
} from '../wxmlElement';

describe('getConditionFromSidOrName', () => {
  test('only name', () => {
    expect(
      renderTemplate({ target: 'wechat', nodeEnv: 'development' }, () =>
        getConditionFromSidOrName({ name: 'view' }),
      ),
    ).toBe(`meta.type === 'view'`);
  });

  test('has simplify id', () => {
    expect(
      renderTemplate({ target: 'wechat', nodeEnv: 'development' }, () =>
        getConditionFromSidOrName({ name: 'view', simplifiedId: 100 }),
      ),
    ).toBe('meta.simplifiedId === 100');
  });
});

describe('getComponentTagName', () => {
  test('simple component', () => {
    expect(
      renderTemplate({ target: 'wechat', nodeEnv: 'development' }, () =>
        getComponentTagName({ name: 'view' }),
      ),
    ).toBe('view');
  });

  test('wrapped component', () => {
    expect(
      renderTemplate({ target: 'wechat', nodeEnv: 'development' }, () =>
        getComponentTagName({ name: 'view', isWrapped: true }),
      ),
    ).toBe('goji-view');
  });
});

describe('getEventName', () => {
  test('alipay', () => {
    expect(
      renderTemplate({ target: 'wechat', nodeEnv: 'development' }, () =>
        getEventName({ target: 'alipay', event: 'touchstart' }),
      ),
    ).toBe('onTouchstart');
  });

  test('other targets', () => {
    expect(
      renderTemplate({ target: 'wechat', nodeEnv: 'development' }, () =>
        getEventName({ target: 'wechat', event: 'touchstart' }),
      ),
    ).toBe('bindtouchstart');
    expect(
      renderTemplate({ target: 'wechat', nodeEnv: 'development' }, () =>
        getEventName({ target: 'baidu', event: 'touchstart' }),
      ),
    ).toBe('bindtouchstart');
    expect(
      renderTemplate({ target: 'wechat', nodeEnv: 'development' }, () =>
        getEventName({ target: 'qq', event: 'touchstart' }),
      ),
    ).toBe('bindtouchstart');
    expect(
      renderTemplate({ target: 'wechat', nodeEnv: 'development' }, () =>
        getEventName({ target: 'toutiao', event: 'touchstart' }),
      ),
    ).toBe('bindtouchstart');
  });
});

describe('element', () => {
  test('with children', () => {
    expect(element({ tagName: 'view', attributes: ['class="cls"'], children: '<input />' })).toBe(t`
      <view
        class="cls"
      >
        <input />
      </view>
    `);
  });

  test('without children', () => {
    expect(element({ tagName: 'view', attributes: ['class="cls"'], children: '' })).toBe(t`
      <view
        class="cls"
      />
    `);
  });
});
