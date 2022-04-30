---
sidebar_position: 1
---

# 样式

## CSS模块

Goji 支持并建议使用 [CSS Module ](https://github.com/css-modules/css-modules)，原因如下：

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

在生产模式下，所有类名称都被哈希到随机字符串中，默认长度是 `5`。

在开发模式下，为了更好地调试体验，类名将包含 `path`， `name` 和 `local`， 在开发模式下，为了更好地调试体验，类名将包含 `path`， `name` 和 `local`， 详情请查看 [css-loader的 localIdentname](https://github.com/webpack-contrib/css-loader#localidentname)。

## PostCSS

GojijS 选择常见的 PostCSS 作为 CSS 处理器，并开启了以下插件。

- [postcss-preset-env](https://github.com/csstools/postcss-preset-env)

支持 `iOS >= 8` 和 `Android >= 4`。

- [postcss-px2units](https://github.com/yingye/postcss-px2units)

```css
/* input */
p {
  margin: 0 0 20px;
  font-size: 32px;
  line-height: 1.2;
  letter-spacing: 1px; /* no */
}

/* output */
p {
  margin: 0 0 20rpx;
  font-size: 32rpx;
  line-height: 1.2;
  letter-spacing: 1px;
}
```

- [postcss-nested](https://github.com/postcss/postcss-nested)

```css
/* input */
.phone {
  &_title {
    width: 500px;
  }
  img {
    display: block;
  }
}

/* output */
.phone_title {
  width: 500px;
}
.phone img {
  display: block;
}
```
