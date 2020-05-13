# GojiJS

React ❤️ Mini Program

## Visions

GojiJS enables running React code on multi Mini Program platforms.

## Features

- Fully support React

You can use the latest version of React in GojiJS. Features including class / functional components,
hooks, portal can work well on GojiJS.

- Cross platforms ability

For now, GojiJS supports these platforms:

- Wechat
- Baidu
- Alipay
- QQ
- Toutiao
- Kuai App ( TBD )
- Web ( TBD )

## Demo

In GojiJS you can write React code like this:

```js
import React, { useState } from 'react';
import { View, Text, Button, render } from '@goji/core';
import styles from './index.css';

const App = () => {
  const [count, setCount] = useState(0);
  return (
    <View className={styles.wrapped}>
      <Text>{count}</Text>
      <Button onClick={() => setCount(count + 1)}>+</Button>
    </View>
  );
};

render(App);
```

The main difference between GojiJS and React DOM is you have to use built-in components from
`@goji/core`. You can find
[all components here](https://developers.weixin.qq.com/miniprogram/dev/component/).

> The official document site for GojiJS is still WIP.
