---
id: cross-platform
title: Cross-Platform Development
sidebar_label: Cross-Platform
---

## Supported Platforms

Goji currently support these platforms. Each target has a `TARGET` name.

| Platform                                                                                                  | `TARGET`  |
| --------------------------------------------------------------------------------------------------------- | --------- |
| [WeChat](https://developers.weixin.qq.com/miniprogram/dev/framework/)                                     | `wechat`  |
| [Baidu](https://smartprogram.baidu.com/developer/index.html)                                              | `baidu`   |
| [Alipay](https://docs.alipay.com/mini/developer)                                                          | `alipay`  |
| [QQ](https://q.qq.com/wiki/develop/miniprogram/frame/)                                                    | `qq`      |
| [Toutiao](https://developer.toutiao.com/dev/cn/mini-app/introduction/about-mini-app/general-introduction) | `toutiao` |

## CLI environment

To build different targets you should add `TARGET` environment variable before `yarn start` or
`yarn build`.

For example, run `TARGET=baidu yarn start` to build the Baidu Mini Program in development mode.

## Conditions in JavaScript code

The current target can be checked by `process.env.TARGET` in JavaScript code. This example shows how
it works.

```tsx
switch (process.env.TARGET) {
  case 'wechat':
    return 'Hello, WeChat!';
  case 'baidu':
    return 'Hello, Baidu!';
  // ...
  default:
    return 'Unknown';
}
```

## Conditions in config code

Only `.config.js` config file support conditions check of the target.

```js
modele.exports = ({ target }) => {
  if (target === 'alipay') {
    return {
      defaultTitle: '预订详情',
    };
  } else {
    return {
      navigationBarTitleText: '预订详情',
    };
  }
};
```

> **[[Proposal]](https://app.asana.com/0/1147595010451657/1147595010451665)** Wrong config file may
> cause warning in some platforms. For example, if you use Alipay's filed `defaultTitle` in WeChat
> Mini Program you may see this warning.
> ![image](https://user-images.githubusercontent.com/1812118/68004991-9f61b300-fcae-11e9-9892-4797f2a9da7d.png)
> To fix this issue we can use implement a new package `@goji/config-generator` which can auto
> adjust the config files for different platforms.
