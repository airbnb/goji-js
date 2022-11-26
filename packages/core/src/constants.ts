export const GOJI_VIRTUAL_ROOT = 'GOJI_VIRTUAL_ROOT';
export const TYPE_TEXT = 'GOJI_TYPE_TEXT';
export const TYPE_SUBTREE = 'GOJI_TYPE_SUBTREE';

export type GojiTarget = 'wechat' | 'baidu' | 'alipay' | 'toutiao' | 'qq' | 'toutiao';

export interface SimplifyComponent {
  name: string;
  properties: Array<string>;
  events: Array<string>;
}

export const SIMPLIFY_COMPONENTS: Array<SimplifyComponent> = [
  {
    name: 'view',
    properties: ['className', 'style'],
    events: [],
  },
];

/**
 * Get identifiers used by template. For production we use shorter identifiers for less bundle size.
 * This function is shared by both `@goji/core` and `@goji/webpack-plugin`.
 *
 * meta: for element data source, e.g. `<template data="{{ meta: meta }}" />`
 * props: for element props object, e.g. `<input value="{{meta.props.value}}" />`
 * type: for element type, e.g. `<input wx:if="{{meta.type === 'input'}}" />`
 * text: for text element content, e.g. `<text>{{meta.text}}</text>`
 * children: for element's children, e.g. `<block wx:for="{{meta.children}}" />`
 * gojiId: for element Goji id, which is the unique id for each element, e.g. <view data-goji-id="{{meta.gojiId}}">
 * simplifiedId: for element simplified id
 */
export const getTemplateIds = (nodeEnv = process.env.NODE_ENV) =>
  nodeEnv === 'production'
    ? {
        meta: 'm',
        props: 'p',
        type: 't',
        text: 'x',
        children: 'c',
        gojiId: 'g',
        simplifiedId: 's',
      }
    : {
        meta: 'meta',
        props: 'props',
        type: 'type',
        text: 'text',
        children: 'children',
        gojiId: 'gojiId',
        simplifiedId: 'simplifiedId',
      };
