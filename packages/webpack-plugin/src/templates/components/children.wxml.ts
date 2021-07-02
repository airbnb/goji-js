import { CommonContext } from '../helpers/context';
import { t } from '../helpers/t';

export const childrenWxml = ({
  componentsDepth,
  maxDepth,
}: {
  componentsDepth: number;
  maxDepth: number;
}) => {
  const fixBaiduTemplateBug = CommonContext.read().target === 'baidu';

  if (componentsDepth < maxDepth) {
    return t`
      <import src="./components${componentsDepth}.wxml" />
      <block wx:for="{{c}}" wx:key="id">
        ${
          // `item.sid: undefined` on Baidu doesn't work
          // remember to add all fields which may be undefined
          // see: swanide://fragment/30ae9e8c97610d93bac049245254dea51576484421939
          fixBaiduTemplateBug
            ? t`
            <template is="$$GOJI_COMPONENT${componentsDepth}" data="{{ ...item, sid: item.sid }}" />
          `
            : t`
          <template is="$$GOJI_COMPONENT${componentsDepth}" data="{{ ...item }}" />
        `
        }
      </block>
    `;
  }
  return t`
    <goji-subtree goji-id="{{id}}" nodes="{{c}}" />
  `;
};
