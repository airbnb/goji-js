---
sidebar_position: 1
---

# 常见问题

## 如何在微信小程序上禁用分享？

抱歉，它尚未实现。

> **[Proposal]**  给 `render` 添加参数 `disableSharing: true`，这样Goji就不会在初始化页面的方法注入 `onShareAppMessage` 。 但这也意味着您不应该使用  `使用OnShareAppMessage`， 否则代码将会告警。

## 如何使用微信中的事件冒泡、组件间关系或百度中的 `dispatch`？

组件交流是原生小程序中最复杂和最糟糕的设计之一。

在 Goji 中，我们建议使用 [React Context](https://reactjs.org/docs/context.html) 或专业的状态管理工具，例如 [Redux](https://redux.js.org/)。

## 为什么会有 `Subtree`？

[TODO]

在非微信平台上，`Subtree` 将渲染成 `React.Fragment`。

## 我何时应该使用 `Subtree`?

[TODO]
