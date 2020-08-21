---
id: refs
title: Refs and useRenderedEffect
sidebar_label: Refs
---

## Purpose

Unlike frameworks like React DOM or vanilla JavaScript, the is no way to modify the DOM elements in
Mini Program. But there is still some cases that developers need to access the instance of a
specific element. For example,
[wx.createIntersectionObserver](https://developers.weixin.qq.com/miniprogram/dev/api/wxml/wx.createIntersectionObserver.html)
API return an observe that could watch the page scrolling and trigger when the intersection of a
target element changed.

## Refs

Because GojiJS use React components rather than Mini Program
[custom components](https://developers.weixin.qq.com/miniprogram/dev/framework/custom-component/),
an elements might be rendered in the top of page or inside a custom component according to different
runtime.

For example, this case on WeChat the `view-a` rendered in the page and the `view-b` rendered inside
`Subtree` component.

> `Subtree` is a special built-in component that tell GojiJS to render its children in another
> custom component. It works like `Fragment` on non-WeChat platforms.

```tsx
const Comp = () => {
  const refA = useRef<GojiPublicInstance | null>();
  const refB = useRef<GojiPublicInstance | null>();
  return (
    <View className="view-a" ref={refA}>
      <Subtree>
        <View className="view-b" ref={refB}>
          hi
        </View>
      </Subtree>
    </View>
  );
};
render(<Comp />);
```

So we should use `refA` to observe the `view-a` and `refB` to `view-b`.

## `useRenderedEffect`

There is a main difference between Mini Programs and Web Apps, it is all DOMs modifications are
async applied. The second argument of
[setData](https://developers.weixin.qq.com/miniprogram/dev/reference/api/Page.html#Page-prototype-setData-Object-data-Function-callback)
is a callback that run every time DOMs changes done.

`useRenderedEffect` works as same as the `setData`'s callback. This hook runs after it make sure the
DOMs are ready to observe. It's the earliest time to access the refs. If you use refs inside
`useEffect`, the `ref.current` might be `undefined`.

Please remember we recommend to use `useEffect` in any time only except using refs.

## Usage

Here is a full example.

`getComponentInstance` returns the `this` instance of which custom component that rendered inside.

`getComponentInstance` returns `undefined` if the element was rendered on page.

```tsx
import React, { useRef } from 'react';
import { View, useRenderedEffect, GojiPublicInstance } from '@goji/core';

const Comp = () => {
  const viewRef = useRef<GojiPublicInstance | null>();
  useRenderedEffect(() => {
    const init = async () => {
      if (viewRef.current) {
        const componentInstance = await viewRef.current.getComponentInstance();
        const observe = componentInstance
          ? componentInstance.createIntersectionObserver()
          : wx.createIntersectionObserver();
        observer.relativeToViewport(...);
      }
    };

    init();
  }, []);

  return <View ref={viewRef}>hello, world!</View>;
};
```
