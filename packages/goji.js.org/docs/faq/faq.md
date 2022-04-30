---
sidebar_position: 1
---

# FAQ

## How to disable sharing on WeChat Mini Program ?

Sorry, it hasn't been implemented.

> **[Proposal]** Add option `disableSharing: true` in the second argument of `render` and Goji won't
> inject `onShareAppMessage` methods when initializing page. But it also means you should not use
> `useOnShareAppMessage` otherwise a warning will log.

## How to use WeChat bubble event, component relationship or Baidu `dispatch` ?

Component communication is one of the most complex and awful designs in the native Mini Program.

In Goji we advice to use [React Context](https://reactjs.org/docs/context.html) or professional
state management tools like [Redux](https://redux.js.org/).

## Why `Subtree` ?

[TODO]

`Subtree` will render to `React.Fragment` on non-wechat platforms.

## When should I use `Subtree` ?

[TODO]
