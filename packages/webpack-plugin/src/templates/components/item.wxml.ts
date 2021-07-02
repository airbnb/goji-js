import { t } from '../helpers/t';

export const itemWxml = ({
  relativePathToBridge,
  fixBaiduTemplateBug,
}: {
  relativePathToBridge: string;
  fixBaiduTemplateBug: boolean;
}) => {
  // `item.sid: undefined` on Baidu doesn't work
  // remember to add all fields which may be undefined
  // see: swanide://fragment/30ae9e8c97610d93bac049245254dea51576484421939
  const children = fixBaiduTemplateBug
    ? t`<template is="$$GOJI_COMPONENT0" data="{{ ...item, sid: item.sid }}" />`
    : t`<template is="$$GOJI_COMPONENT0" data="{{ ...item }}" />`;

  return t`
    <import src="${relativePathToBridge}/components0.wxml"/>

    <block wx:for="{{c}}" wx:key="id">
      ${children}
    </block>
  `;
};
