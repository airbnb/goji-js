import { transformTemplate } from '../render';

describe('transformTemplate', () => {
  describe('wxml', () => {
    test('if condition', async () => {
      const source = '<view wx:if="{{condition}}">hi</view>';
      expect(await transformTemplate(source, 'wechat', 'wxml')).toBe(
        '<view wx:if="{{condition}}">hi</view>',
      );
      expect(await transformTemplate(source, 'baidu', 'wxml')).toBe(
        '<view s-if="condition">hi</view>',
      );
      expect(await transformTemplate(source, 'alipay', 'wxml')).toBe(
        '<view a:if="{{condition}}">hi</view>',
      );
      expect(await transformTemplate(source, 'toutiao', 'wxml')).toBe(
        '<view tt:if="{{condition}}">hi</view>',
      );
      expect(await transformTemplate(source, 'qq', 'wxml')).toBe(
        '<view wx:if="{{condition}}">hi</view>',
      );
    });

    test('for loop', async () => {
      const source = '<view wx:for="{{arr}}">{{item}}</view>';
      expect(await transformTemplate(source, 'wechat', 'wxml')).toBe(
        '<view wx:for="{{arr}}">{{item}}</view>',
      );
      expect(await transformTemplate(source, 'baidu', 'wxml')).toBe(
        '<view s-for="item, index in arr">{{item}}</view>',
      );
      expect(await transformTemplate(source, 'alipay', 'wxml')).toBe(
        '<view a:for="{{arr}}">{{item}}</view>',
      );
      expect(await transformTemplate(source, 'toutiao', 'wxml')).toBe(
        '<view tt:for="{{arr}}">{{item}}</view>',
      );
      expect(await transformTemplate(source, 'qq', 'wxml')).toBe(
        '<view wx:for="{{arr}}">{{item}}</view>',
      );
    });

    test('for loop with key', async () => {
      const source = '<view wx:for="arr" wx:key="id">{{item}}</view>';
      expect(await transformTemplate(source, 'wechat', 'wxml')).toBe(
        '<view wx:for="arr" wx:key="id">{{item}}</view>',
      );
      expect(await transformTemplate(source, 'baidu', 'wxml')).toBe(
        '<view s-for="item, index in arr trackBy item.id">{{item}}</view>',
      );
      expect(await transformTemplate(source, 'alipay', 'wxml')).toBe(
        '<view a:for="arr" a:key="id">{{item}}</view>',
      );
      expect(await transformTemplate(source, 'toutiao', 'wxml')).toBe(
        '<view tt:for="arr" tt:key="id">{{item}}</view>',
      );
      expect(await transformTemplate(source, 'qq', 'wxml')).toBe(
        '<view wx:for="arr" wx:key="id">{{item}}</view>',
      );
    });

    test('for loop with key *this', async () => {
      const source = '<view wx:for="arr" wx:key="*this">{{item}}</view>';
      expect(await transformTemplate(source, 'wechat', 'wxml')).toBe(
        '<view wx:for="arr" wx:key="*this">{{item}}</view>',
      );
      expect(await transformTemplate(source, 'baidu', 'wxml')).toBe(
        '<view s-for="item, index in arr trackBy item">{{item}}</view>',
      );
      expect(await transformTemplate(source, 'alipay', 'wxml')).toBe(
        '<view a:for="arr" a:key="*this">{{item}}</view>',
      );
      expect(await transformTemplate(source, 'toutiao', 'wxml')).toBe(
        '<view tt:for="arr" tt:key="*this">{{item}}</view>',
      );
      expect(await transformTemplate(source, 'qq', 'wxml')).toBe(
        '<view wx:for="arr" wx:key="*this">{{item}}</view>',
      );
    });

    test('include', async () => {
      const source = '<include src="../../test.wxml" />';
      expect(await transformTemplate(source, 'wechat', 'wxml')).toBe(
        '<include src="../../test.wxml" />',
      );
      expect(await transformTemplate(source, 'baidu', 'wxml')).toBe(
        '<include src="../../test.swan" />',
      );
      expect(await transformTemplate(source, 'alipay', 'wxml')).toBe(
        '<include src="../../test.axml" />',
      );
      expect(await transformTemplate(source, 'toutiao', 'wxml')).toBe(
        '<include src="../../test.ttml" />',
      );
      expect(await transformTemplate(source, 'qq', 'wxml')).toBe(
        '<include src="../../test.wxml" />',
      );
    });

    test('template with data', async () => {
      const source = `<template is="head" data="{{...item, name: 'hello'}}" />`;
      expect(await transformTemplate(source, 'wechat', 'wxml')).toBe(
        `<template is="head" data="{{...item, name: 'hello'}}" />`,
      );
      expect(await transformTemplate(source, 'baidu', 'wxml')).toBe(
        `<template is="head" data="{{{...item, name: 'hello'}}}" />`,
      );
      expect(await transformTemplate(source, 'alipay', 'wxml')).toBe(
        `<template is="head" data="{{...item, name: 'hello'}}" />`,
      );
      expect(await transformTemplate(source, 'toutiao', 'wxml')).toBe(
        `<template is="head" data="{{...item, name: 'hello'}}" />`,
      );
      expect(await transformTemplate(source, 'qq', 'wxml')).toBe(
        `<template is="head" data="{{...item, name: 'hello'}}" />`,
      );
    });

    test('input auto closed', async () => {
      const source = `<input value="{{1}}"></input>`;
      // FIXME: not support non-baidu platforms yet
      // expect(await transformTemplate(source, 'wechat', 'wxml')).toBe(`<input value="{{1}}" />`);
      expect(await transformTemplate(source, 'baidu', 'wxml')).toBe(`<input value="{{1}}" />`);
      // expect(await transformTemplate(source, 'alipay', 'wxml')).toBe(`<input value="{{1}}" />`);
      // expect(await transformTemplate(source, 'toutiao', 'wxml')).toBe(`<input value="{{1}}" />`);
      // expect(await transformTemplate(source, 'qq', 'wxml')).toBe(`<input value="{{1}}" />`);
    });
  });

  describe('wxss', () => {
    test('fix toutiao issue #160', async () => {
      expect(await transformTemplate('height:200px!important', 'toutiao', 'wxss')).toBe(
        'height:200px !important',
      );
      expect(await transformTemplate('color:red!important', 'toutiao', 'wxss')).toBe(
        'color:red !important',
      );
      // ignore if not uglified
      expect(await transformTemplate('height: 200px !important', 'toutiao', 'wxss')).toBe(
        'height: 200px !important',
      );
    });

    test('fix toutiao issue #159', async () => {
      expect(await transformTemplate('height:calc(100rpx*10)', 'toutiao', 'wxss')).toBe(
        'height:calc(100rpx *10)',
      );
      expect(await transformTemplate('height:calc(100rpx/ 10)', 'toutiao', 'wxss')).toBe(
        'height:calc(100rpx / 10)',
      );
    });
  });
});
