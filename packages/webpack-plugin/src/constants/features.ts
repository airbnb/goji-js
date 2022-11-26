import { GojiTarget } from '@goji/core';

export const getFeatures = (target: GojiTarget) => ({
  useSubtree: target === 'wechat' || target === 'qq',

  // Alipay only support recursion dependency self to self so we have to inline the children.wxml
  // Success: A -> A -> A
  // Fail: A -> B -> A
  useInlineChildrenInComponent: target === 'alipay',

  // Baidu fails to render if an outside same `<include>` exists
  // https://github.com/airbnb/goji-js/issues/185
  useInlineChildrenInItem: target === 'baidu',

  // Baidu doesn't support `template` inside `text` so we need to flat text manually
  useFlattenText: target === 'baidu',

  // Alipay has a bug that should use `swiper-item` directly inside `swiper`, no `template` is accepted
  useFlattenSwiper: target === 'alipay',
});
