---
sidebar_position: 2
---

# Page

## Page entry

To add a new page, you need to add the page path to [app config](./app.md#app-config).

## Page file

Add a new `.jsx` or `.tsx` file at the path in app config then call `render` function to init a
page.

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
