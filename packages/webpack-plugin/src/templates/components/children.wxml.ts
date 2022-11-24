import { getIds } from '../helpers/ids';
import { t } from '../helpers/t';

export const childrenWxml = ({
  componentsDepth,
  maxDepth,
}: {
  componentsDepth: number;
  maxDepth: number;
}) => {
  const ids = getIds();

  if (componentsDepth < maxDepth) {
    return t`
      <import src="./components${componentsDepth}.wxml" />
      <block wx:for="{{${ids.meta}.${ids.children}}}" wx:key="${ids.gojiId}">
        ${
          // pass the whole object to prevent this bug https://github.com/airbnb/goji-js/issues/179
          t`<template is="$$GOJI_COMPONENT${componentsDepth}" data="{{ ${ids.meta}: item }}" />`
        }
      </block>
    `;
  }
  return t`
    <goji-subtree goji-id="{{${ids.meta}.${ids.gojiId}}}" nodes="{{${ids.meta}.${ids.children}}}" />
  `;
};
