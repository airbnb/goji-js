import { GojiTarget } from '@goji/core';

export const getFeatures = (target: GojiTarget) => ({
  useSubtree: target === 'wechat' || target === 'qq',

  useInlineChildrenInComponent:
    // Alipay only support circular dependency self to self so we have to inline the children.wxml
    // Success: A -> A -> A
    // Fail: A -> B -> A
    target === 'alipay' ||
    // Baidu changes the behavior of circular dependency on dev tool >= v4.22 with new compiler
    // so we have to inline the children.wxml
    // https://smartprogram.baidu.com/docs/develop/devtools/beta-notify#_5-%E6%A8%A1%E6%9D%BF-import-%E8%AF%AD%E6%B3%95%E4%B8%8D%E5%85%81%E8%AE%B8%E5%BE%AA%E7%8E%AF%E5%BC%95%E7%94%A8%E3%80%82
    target === 'baidu',

  // Baidu fails to render if an outside same `<include>` exists
  // https://github.com/airbnb/goji-js/issues/185
  useInlineChildrenInItem: target === 'baidu',

  // Baidu doesn't support `template` inside `text` so we need to flat text manually
  useFlattenText: target === 'baidu',

  // Alipay has a bug that should use `swiper-item` directly inside `swiper`, no `template` is accepted
  useFlattenSwiper: target === 'alipay',
});
