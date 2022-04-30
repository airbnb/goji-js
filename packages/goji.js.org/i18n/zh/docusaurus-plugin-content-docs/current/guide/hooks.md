---
sidebar_position: 3
---

# 钩子

## Hooks

Goji 支持所有React内置的钩子，例如 `useState`, `useEffect` 和 `useContext`。 你可以在[这里](https://reactjs.org/docs/hooks-reference.html)找到所有钩子。

Goji还支持第三方库中的钩子。 这是使用 `react-redux` 的例子：

```tsx
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { myDataStringSelector } from './path/to/myDataStringSelector';

const Comp = () => {
  const dispatch = useDispatch();
  const dataString = useSelector(myDataStringSelector);
  useEffect(() => {
    dispatch({
      type: 'APP_DID_MOUNT',
    });
  }, []);

  return <View>{dataString}</View>;
};
```

在下一节中，你将看到Goji内置的 [生命周期钩子](./lifecycle.md)。
