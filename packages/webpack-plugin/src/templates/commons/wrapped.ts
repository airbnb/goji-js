import { t } from '../helpers/t';

export interface WrappedConfig {
  memorizedProps?: Array<string>;
  overrideEvents?: Array<string>;
  overrideEventsCode?: Record<string, string>;
  customizedChildren?: string;
}

export const DEFAULT_WRAPPED_CONFIG: WrappedConfig = {};

export const WRAPPED_CONFIGS: Record<string, WrappedConfig> = {
  input: {
    memorizedProps: ['value', 'focus'],
    overrideEvents: ['input'],
  },
  map: {
    memorizedProps: ['longitude', 'latitude', 'scale'],
    overrideEvents: ['regionchange'],
    overrideEventsCode: {
      // there is a bug on WeChat that the `evt.type` of `regionchange` is not consistent with its name
      regionchange: t`
        onRegionchange(evt) {
          evt.type = 'regionchange';
          this.e(evt);
        },
      `,
    },
  },
  'scroll-view': {
    memorizedProps: ['scroll-top', 'scroll-left', 'scroll-into-view'],
  },
  textarea: {
    memorizedProps: ['value', 'focus'],
    overrideEvents: ['input'],
  },
  swiper: {
    memorizedProps: ['current'],
    // should manually flat the `swiper-item` here as `swiper` required https://developers.weixin.qq.com/miniprogram/dev/component/swiper.html
    // we assume there won't be any other elements except `swiper-item`
    // don't use style here because WeChat's bug https://developers.weixin.qq.com/community/develop/doc/00064c6c9a4650420e59218ea5ac00
    customizedChildren: t`
      <import src="../components1.wxml" />
      <swiper-item
        wx:for="{{nodes}}"
        wx:key="id"
        class="{{item.props.className}}"
        item-id="{{item.props.itemId}}"
        data-goji-id="{{item.id}}"
      >
        <block wx:for="{{item.c}}" wx:key="id">
          <template is="$$GOJI_COMPONENT1" data="{{ ...item }}" />
        </block>
      </swiper-item>
    `,
  },
};
