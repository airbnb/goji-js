---
sidebar_position: 1
---

# CSS Module

## CSS Module

GojiJS support [CSS Module](https://github.com/css-modules/css-modules) by default and recommend to
use it for these reasons.

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

In production mode, all class names are hashed to a random string and default length is `5`.

In development mode, for better debug experience the class names will contain `path`, `name` and
`local`. For more details please see
[css-loader's localIdentName](https://github.com/webpack-contrib/css-loader#localidentname).

## PostCSS

GojiJS choses the well-known PostCSS as the CSS transformer and enables following plugins.

- [postcss-preset-env](https://github.com/csstools/postcss-preset-env)

Support `iOS >= 8` and `Android >= 4`.

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
