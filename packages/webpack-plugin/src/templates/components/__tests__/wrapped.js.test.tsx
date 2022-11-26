import { renderTemplate } from '../..';
import { ComponentDesc, getBuiltInComponents } from '../../../constants/components';
import { updateInternalValueHandler, WrappedConfig } from '../../commons/wrapped';
import { t } from '../../helpers/t';
import { processWrappedEvents, processWrappedProps, wrappedJs } from '../wrapped.js';

describe('wrapped.js', () => {
  const mockMapComponent: ComponentDesc = {
    name: 'view',
    props: {
      scale: {
        defaultValue: 16,
        type: 'Number',
        required: false,
      },
      rotate: {
        defaultValue: 0,
        type: 'Number',
        required: false,
      },
    },
    events: ['regionchange', 'poitap', 'input'],
    isLeaf: false,
    isWrapped: true,
  };
  const mockConfig: WrappedConfig = {
    memorizedProps: ['scale'],
    customizedEventHandler: {
      // there is a bug on WeChat that the `evt.type` of `regionchange` is not consistent with its name
      regionchange: t`
        onRegionchange(evt) {
          evt.type = 'regionchange';
          this.e(evt);
        },`,
      input: updateInternalValueHandler('input', 'value'),
    },
  };

  test('process props', () => {
    const result = renderTemplate({ target: 'wechat', nodeEnv: 'development' }, () =>
      processWrappedProps({
        component: mockMapComponent,
        config: mockConfig,
      }),
    );
    expect(result.data).toMatchSnapshot('data');
    expect(result.properties).toMatchSnapshot('properties');
    expect(result.attachedInitData).toMatchSnapshot('attachedInitData');
  });

  test('process events', () => {
    const result = processWrappedEvents({
      component: mockMapComponent,
      config: mockConfig,
    });
    expect(result.methods.find(_ => /onRegionchange/.test(_))).toBe(
      t`
      onRegionchange(evt) {
        evt.type = 'regionchange';
        this.e(evt);
      },`,
    );
    expect(result.methods.find(_ => /onInput/.test(_))).toBe(
      t`
      onInput(evt) {
        this.data.internalValue.value = evt.detail.value;
        this.e(evt);
      },`,
    );
  });

  test('snapshot works', () => {
    const components = getBuiltInComponents('wechat');
    const getResult = (name: string) =>
      renderTemplate({ target: 'wechat', nodeEnv: 'development' }, () =>
        wrappedJs({ component: components.find(_ => _.name === name)! }),
      );
    expect(getResult('map')).toMatchSnapshot('map');
    expect(getResult('input')).toMatchSnapshot('input');
    expect(getResult('textarea')).toMatchSnapshot('textarea');
    expect(getResult('textarea')).toMatchSnapshot('textarea');
    expect(getResult('scroll-view')).toMatchSnapshot('scroll-view');
    expect(getResult('swiper')).toMatchSnapshot('swiper');
  });
});
