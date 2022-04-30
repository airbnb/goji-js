---
sidebar_position: 1
---

# Introduction

## Visions

Goji enables running React code on multi Mini Program platforms.

## Features

### Fully support React

You can use the latest version of React in Goji. Features including class / functional components,
hooks, portal can work well on Goji.

### Cross platforms ability

For now, Goji supports these platforms:

- WeChat Mini Program
- Baidu Smart Program
- Alipay Mini Program
- Toutiao Micro App
- QQ Mini Program
- Kuai App ( TBD )
- Web ( TBD )

## Demo

In Goji you can write React code like this:

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

The main difference between Goji and React DOM is you have to use built-in components from
`@goji/core`. You can find
[all components here](https://developers.weixin.qq.com/miniprogram/dev/component/).

Get excited about Goji ? Let's start a new Goji project in few steps.
