import { GojiTarget } from '@goji/core';

export const getFeatures = (target: GojiTarget) => ({
  useSubtree: target === 'wechat' || target === 'qq',

  // alipay only support recursion dependency self to self so we have to inline the children.wxml
  // Success: A -> A -> A
  // Fail: A -> B -> A
  useInlineChildren: target === 'alipay',

  // Baidu doesn't support `template` inside `text` so we need to flat text manually
  useFlattenText: target === 'baidu',

  // Baidu has a bug that should use `movable-view` directly inside `movable-area`, no `template` is accepted
  useFlattenMovableArea: target === 'baidu',

  // Alipay has a bug that should use `swiper-item` directly inside `swiper`, no `template` is accepted
  useFlattenSwiper: target === 'alipay',
});
