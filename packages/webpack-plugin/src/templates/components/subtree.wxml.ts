import { getIds } from '../helpers/ids';
import { t } from '../helpers/t';

export const subtreeWxml = () => {
  const ids = getIds();

  return t`
    <import src="./components0.wxml" />

    <block wx:for="{{${ids.meta}.${ids.children}}}" wx:key="${ids.gojiId}">
      <template is="$$GOJI_COMPONENT0" data="{{ ${ids.meta}: item }}" />
    </block>
  `;
};
