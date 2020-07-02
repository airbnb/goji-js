---
id: css
title: CSS
sidebar_label: CSS
---

## CSS模块

Goji 支持并建议使用 [CSS 模块](https://github.com/css-modules/css-modules)，原因如下：

- CSS类作用域
- 使用 [mini-css-extract-plugin](https://github.com/webpack-contrib/mini-css-extract-plugin) 减少主包体积
- 多种CSS 预/后续处理器，如 [PostCSS](https://github.com/postcss/postcss), [ Stylus](http://stylus-lang.com/) 等。

```tsx
// comp.tsx
import React from 'react';
import { View } from '@goji/core';
import styles from './comp.css';

export const Comp = () => {
  return <View className={styles.container} />;
};
```

## 哈希后的类名称

在生产模式下，所有类名称都被哈希到随机字符串中，默认长度是 `5`。

在开发模式下，为了更好地调试体验，类名将包含 `path`， `name` 和 `local`， 详情请查看 [css-loader的 localIdentname](https://github.com/webpack-contrib/css-loader#localidentname)。
