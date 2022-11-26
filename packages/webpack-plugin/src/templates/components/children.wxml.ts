import { getIds } from '../helpers/ids';
import { t } from '../helpers/t';

export const noNeedImport = Symbol('no need to import component template');

export const childrenWxml = ({
  relativePathToBridge,
  componentDepth,
}: {
  relativePathToBridge: string | typeof noNeedImport;
  componentDepth: number;
}) => {
  const ids = getIds();

  return t`
    ${
      relativePathToBridge !== noNeedImport &&
      `<import src="${relativePathToBridge}/components${componentDepth}.wxml" />`
    }
    <block wx:for="{{${ids.meta}.${ids.children}}}" wx:key="${ids.gojiId}">
      ${
        // pass the whole object to prevent this bug https://github.com/airbnb/goji-js/issues/179
        t`<template is="$$GOJI_COMPONENT${componentDepth}" data="{{ ${ids.meta}: item }}" />`
      }
    </block>
  `;
};
