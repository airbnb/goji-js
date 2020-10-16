# GojiJS

![Goji Core](https://img.shields.io/npm/v/@goji/core?label=Goji%20Core)
![Goji CLI](https://img.shields.io/npm/v/@goji/cli?label=Goji%20CLI)
![Create Goji App](https://img.shields.io/npm/v/create-goji-app?label=Create%20Goji%20App)

React ❤️ Mini Program

[中文文档](https://goji.js.org/docs/zh-CN/introduction.html)

[English](https://goji.js.org/docs/en/introduction)

## Visions

GojiJS enables running React code on multi Mini Program platforms.

## Features

- Fully supports React

You can use the latest version of React in GojiJS. Features including class / functional components,
hooks, portal can work well on GojiJS.

- Cross platforms ability

For now, GojiJS supports these platforms:

- WeChat
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

For more details, see [GojiJS official documentation website](https://goji.js.org/en/).
