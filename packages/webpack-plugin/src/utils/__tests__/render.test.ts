import { transformTemplate } from '../render';

describe('transformTemplate', () => {
  describe('wxml', () => {
    test('for loop', async () => {
      const source = '<view wx:for="arr"></view>';
      expect(await transformTemplate(source, 'wechat', 'wxml')).toBe('<view wx:for="arr"></view>');
      expect(await transformTemplate(source, 'baidu', 'wxml')).toBe(
        '<view s-for="item, index in arr"></view>',
      );
      expect(await transformTemplate(source, 'alipay', 'wxml')).toBe('<view a:for="arr"></view>');
      expect(await transformTemplate(source, 'toutiao', 'wxml')).toBe('<view tt:for="arr"></view>');
      expect(await transformTemplate(source, 'qq', 'wxml')).toBe('<view wx:for="arr"></view>');
    });

    test('for loop with key', async () => {
      const source = '<view wx:for="arr" wx:key="id"></view>';
      expect(await transformTemplate(source, 'wechat', 'wxml')).toBe(
        '<view wx:for="arr" wx:key="id"></view>',
      );
      // temporary remove trackBy
      // expect(await transformTemplate(source, 'baidu', 'wxml')).toBe(
      //   '<view s-for="item, index in arr trackBy item.id"></view>',
      // );
      expect(await transformTemplate(source, 'baidu', 'wxml')).toBe(
        '<view s-for="item, index in arr trackBy item.id"></view>',
      );
      expect(await transformTemplate(source, 'alipay', 'wxml')).toBe(
        '<view a:for="arr" a:key="id"></view>',
      );
      expect(await transformTemplate(source, 'toutiao', 'wxml')).toBe(
        '<view tt:for="arr" tt:key="id"></view>',
      );
      expect(await transformTemplate(source, 'qq', 'wxml')).toBe(
        '<view wx:for="arr" wx:key="id"></view>',
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
  });

  describe('wxss', () => {
    test('toutiao !important', async () => {
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
  });
});
