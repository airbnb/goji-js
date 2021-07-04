import { t } from '../../helpers/t';
import {
  element,
  getComponentTagName,
  getConditionFromSidOrName,
  getEventName,
} from '../wxmlElement';

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

describe('getEventName', () => {
  test('alipay', () => {
    expect(getEventName({ target: 'alipay', event: 'touchstart' })).toBe('onTouchstart');
  });

  test('other targets', () => {
    expect(getEventName({ target: 'wechat', event: 'touchstart' })).toBe('bindtouchstart');
    expect(getEventName({ target: 'baidu', event: 'touchstart' })).toBe('bindtouchstart');
    expect(getEventName({ target: 'qq', event: 'touchstart' })).toBe('bindtouchstart');
    expect(getEventName({ target: 'toutiao', event: 'touchstart' })).toBe('bindtouchstart');
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
