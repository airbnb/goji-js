---
sidebar_position: 3
---

# Hooks

## Hooks

Goji support all React build-in hooks like `useState`, `useEffect` and `useContext`. You can find
these hooks [here](https://reactjs.org/docs/hooks-reference.html).

Goji also support hooks from third-part library. This is an example for `react-redux`:

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

In the next section, you will see Goji build-in [lifecycle hooks](./lifecycle.md).
