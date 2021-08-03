import { ComponentDesc, getBuiltInComponents } from '../../../constants/components';
import { WrappedConfig } from '../../commons/wrapped';
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
    overrideEvents: ['regionchange', 'input'],
    overrideEventsCode: {
      // there is a bug on WeChat that the `evt.type` of `regionchange` is not consistent with its name
      regionchange: t`
      onRegionchange(evt) {
        evt.type = 'regionchange';
        this.e(evt);
      },
    `,
    },
  };

  test('process props', () => {
    const result = processWrappedProps({
      component: mockMapComponent,
      config: mockConfig,
    });
    expect(result.data).toEqual(['internalScale: 16,']);
    expect(result.properties.find(_ => /scale/.test(_))).toEqual(t`
      scale: {
        type: Number,
        observer() {
          if (this.properties.scale !== this.data.internalScale) {
            this.setData({
              internalScale: this.properties.scale,
            });
          }
        },
      },`);
    expect(result.properties.find(_ => /nodes/.test(_))).toEqual(t`
      nodes: {
        type: Object,
      },`);
    expect(result.attachedInitData).toEqual(['internalScale: this.properties.scale,']);
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
        this.data.internalValue = evt.detail.value;
        this.e(evt);
      },`,
    );
  });

  test('snapshot works', () => {
    const components = getBuiltInComponents('wechat');
    const getResult = (name: string) =>
      wrappedJs({ component: components.find(_ => _.name === name)! });
    expect(getResult('map')).toMatchSnapshot('map');
    expect(getResult('input')).toMatchSnapshot('input');
    expect(getResult('textarea')).toMatchSnapshot('textarea');
    expect(getResult('textarea')).toMatchSnapshot('textarea');
    expect(getResult('scroll-view')).toMatchSnapshot('scroll-view');
    expect(getResult('swiper')).toMatchSnapshot('swiper');
  });
});
