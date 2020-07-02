---
id: introduction
title: Introduction
sidebar_label: Introduction
---

## 愿景

Goji可以让React代码运行在多种小程序平台上。

## 功能

- 完整支持React

您可以在Goji中使用最新版本的React。 函数组件、类组件、hooks、portal等功能都可以在Goji中正常工作。

- 跨平台能力

目前Goji支持这些平台：

- Wechat
- Baidu
- Alipay
- QQ
- Toutiao
- Kuai App ( TBD )
- Web ( TBD )

## 例子

在Goji中您可以编写这样的React代码：

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

Goji和React DOM最大的区别是你必须使用`@goji/core`中的内置组件。 你可以在[这里](https://developers.weixin.qq.com/miniprogram/dev/component/)找到所有组件。
