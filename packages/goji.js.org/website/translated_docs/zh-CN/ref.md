---
id: refs
title: Refs 和 useRenderedEffect
sidebar_label: Refs
---

## 目的

与 React DOM 这样的框架或原生 JavaScript不一样的是，在小程序没有办法修改DOM节点。 但是仍然有一情况下，开发者需要访问一个特定节点的实例。 例如，[wx. ReateIntersectionObserver](https://developers.weixin.qq.com/miniprogram/dev/api/wxml/wx.createIntersectionObserver.html) API 返回了一个监听器，它监听页面滚动，当目标节点的交点改变时触发。

## Refs

因为 GojijS 使用 React 组件而不是小程序 [自定义组件](https://developers.weixin.qq.com/miniprogram/dev/framework/custom-component/)，根据运行时不同一个节点可能会在页面上或者自定义组件中渲染。

例如这段代码，在微信小程序里 `view-a` 渲染在页面中但 `view-b` 渲染在`Subtree` 组件中渲染。

> ` Subtree ` 是一个特殊的内置组件，它告诉GojiJS 在另一个自定义组件中渲染 children。 它在非WeChat平台上等同于 ` Fragment `。

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

所以我们应该使用 `refA` 来监听 `view-a` ，使用 `refB` 监听 `view-b`。

## `useRenderedEffect`

小程序和 Web 应用之间有一个主要区别，即所有DOM 修改都是异步生效的。 [setData](https://developers.weixin.qq.com/miniprogram/dev/reference/api/Page.html#Page-prototype-setData-Object-data-Function-callback) 的第二个参数是一个回调，每次 DOM 更改完成后它都会运行。

`userRenderEffect` 等价于 `setData` 的回调。 这个钩子在 DOM 更新完成后运行。 这也是最早可以访问refs的时机。 如果在`useEffect`中使用refs， `ref.current` 可能是 `undefined`。

请记住，我们建议除非要访问refs，在任何时候都使用 `useEffect` ，。

## 用法

下面是一个示例：

`getComponentInstance` 返回渲染它的自定义组件的 `this`。

如果节点是在页面中渲染的，`getComponentInstance`将返回` undefined`。

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
