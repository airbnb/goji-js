---
sidebar_position: 2
---

# 页面

## 页面入口

要添加一个新页面，您需要将页面路径添加到 [应用配置](./app.md#app-config)。

## 页面文件

在应用配置里的路径上，添加一个新的 `.jsx` 或 `. tsx`文件。 然后调用 `render` 初始化页面。

```tsx
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

render(<App />);
```
