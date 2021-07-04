import { t } from '../helpers/t';

export const subtreeWxml = () => {
  return t`
    <import src="./components0.wxml" />

    <block wx:for="{{nodes}}" wx:key="id">
      <template is="$$GOJI_COMPONENT0" data="{{ ...item }}" />
    </block>
  `;
};
