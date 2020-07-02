---
id: css
title: CSS
sidebar_label: CSS
---

## CSS Module

Goji support [CSS Module](https://github.com/css-modules/css-modules) and recommend to use it for
these reasons.

- Scoped CSS class names
- Reduce the main package bundle size by
  [mini-css-extract-plugin](https://github.com/webpack-contrib/mini-css-extract-plugin)
- Multi CSS pre/post processor like [PostCSS](https://github.com/postcss/postcss),
  [Stylus](http://stylus-lang.com/) and etc.

```tsx
// comp.tsx
import React from 'react';
import { View } from '@goji/core';
import styles from './comp.css';

export const Comp = () => {
  return <View className={styles.container} />;
};
```

## Hashed class names

In production mode, all class names are hashed to a random string and default length is `5`.

In development mode, for better debug experience the class names will contain `path`, `name` and
`local`. For more details please see
[css-loader's localIdentName](https://github.com/webpack-contrib/css-loader#localidentname).
