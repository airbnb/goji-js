import { getIds } from '../helpers/ids';
import { t } from '../helpers/t';

export const itemWxml = ({ relativePathToBridge }: { relativePathToBridge: string }) => {
  const ids = getIds();
  // pass the whole object to prevent this bug https://github.com/airbnb/goji-js/issues/179
  const children = t`<template is="$$GOJI_COMPONENT0" data="{{ ${ids.meta}: item }}" />`;

  return t`
    <import src="${relativePathToBridge}/components0.wxml"/>

    <block wx:for="{{${ids.meta}.${ids.children}}}" wx:key="${ids.gojiId}">
      ${children}
    </block>
  `;
};
