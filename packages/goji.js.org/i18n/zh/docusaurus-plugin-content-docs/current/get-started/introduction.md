---
sidebar_position: 1
---

# 介绍

## 愿景

Goji可以让React代码运行在多种小程序平台上。

## 功能

### 完整支持React

您可以在Goji中使用最新版本的React。 函数组件、类组件、hooks、portal等功能都可以在Goji中正常工作。

### 跨平台能力

目前Goji支持这些平台：

- 微信小程序
- 百度智能小程序
- 支付宝小程序
- 字节跳动小程序
- QQ小程序
- 快应用（待定）
- Web（待定）

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

对Goji感到兴奋吗？ 让我们在简单几步中创建一个新的 Goji 项目。
