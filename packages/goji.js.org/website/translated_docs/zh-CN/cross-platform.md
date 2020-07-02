---
id: cross-platform
title: Cross-Platform Development
sidebar_label: Cross-Platform
---

## 支持的平台

Goji目前支持这些平台， 每个目标都有一个 `TARGET` 名。

| 平台                                                                                                        | `TARGET`  |
| --------------------------------------------------------------------------------------------------------- | --------- |
| [WeChat](https://developers.weixin.qq.com/miniprogram/dev/framework/)                                     | `wechat`  |
| [Baidu](https://smartprogram.baidu.com/developer/index.html)                                              | `baidu`   |
| [Alipay](https://docs.alipay.com/mini/developer)                                                          | `alipay`  |
| [QQ](https://q.qq.com/wiki/develop/miniprogram/frame/)                                                    | `qq`      |
| [Toutiao](https://developer.toutiao.com/dev/cn/mini-app/introduction/about-mini-app/general-introduction) | `toutiao` |

## CLI环境变量

若要构建不同的目标，您应当在 `yarn start`或`yarn build`前的环境变量中添加` TARGET `。

例如，运行 `TARGET=baidu yarn start` 以开发模式构建百度小程序。

## JavaScript 代码中的条件判断

在 JavaScript 代码中可以可以通过 `process.env.TARGET` 检查当前的构建目标。 此示例展示了它是如何工作的。

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

## 配置代码中的条件判断

只有 `.config.js` 配置文件支持查构建目标。

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

> **[[Proposal]](https://app.asana.com/0/1147595010451657/1147595010451665)**错误的配置文件可能在某些平台上导致警告。 例如，如果您在微信小程序中使用支付宝小程序的 `defaultTitle` ，可能会看到这个警告。 ![image](https://user-images.githubusercontent.com/1812118/68004991-9f61b300-fcae-11e9-9892-4797f2a9da7d.png) 为了解决这个问题，我们可以实现一个新的软件包 `@goji/config-generator` 它可以自动适配不同平台的配置文件。
