import { camelCase } from 'lodash';
import { getIds } from '../helpers/ids';
import { t } from '../helpers/t';

export interface WrappedConfig {
  memorizedProps?: Array<string>;
  customizedEventHandler?: Record<string, string>;
  customizedChildren?: () => string;
}

export const DEFAULT_WRAPPED_CONFIG: WrappedConfig = {};

/**
 * This function is designed fro convert an uncontrolled component to a controlled component.
 * E.g. when input on an `<input>` it always re-render and then emit the `bindinput` event, in this
 * case there is no need to re-render the component again. So we can update `this.data` directly and
 * `observer` would not update the data anymore.
 */
export const updateInternalValueHandler = (eventName: string, propName: string) => t`
  ${camelCase(`on-${eventName}`)}(evt) {
    this.data.${camelCase(`internal-${propName}`)}.value = evt.detail.value;
    this.e(evt);
  },`;

export const WRAPPED_CONFIGS: Record<string, WrappedConfig> = {
  input: {
    memorizedProps: ['value', 'focus'],
    customizedEventHandler: {
      input: updateInternalValueHandler('input', 'value'),
    },
  },
  map: {
    memorizedProps: ['longitude', 'latitude', 'scale'],
    customizedEventHandler: {
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
    customizedEventHandler: {
      input: updateInternalValueHandler('input', 'value'),
    },
  },
  swiper: {
    memorizedProps: ['current'],
    // should manually flat the `swiper-item` here as `swiper` required https://developers.weixin.qq.com/miniprogram/dev/component/swiper.html
    // we assume there won't be any other elements except `swiper-item`
    // don't use style here because WeChat's bug https://developers.weixin.qq.com/community/develop/doc/00064c6c9a4650420e59218ea5ac00
    customizedChildren: () => {
      const ids = getIds();

      return t`
        <import src="../components1.wxml" />
        <swiper-item
          wx:for="{{${ids.meta}.${ids.children}}}"
          wx:key="${ids.gojiId}"
          class="{{item.${ids.props}.className}}"
          item-id="{{item.${ids.props}.itemId}}"
          data-goji-id="{{item.${ids.gojiId}}}"
        >
          <block wx:for="{{item.${ids.children}}}" wx:key="${ids.gojiId}">
            <template is="$$GOJI_COMPONENT1" data="{{ ${ids.meta}: item }}" />
          </block>
        </swiper-item>
      `;
    },
  },
};
