---
sidebar_position: 6
---

# 跨平台

## 支持的平台

Goji目前支持这些平台， 每个平台都有一个 `target` 。

| 平台                                                                   | `target`  |
| -------------------------------------------------------------------- | --------- |
| [微信小程序](https://developers.weixin.qq.com/miniprogram/dev/framework/) | `wechat`  |
| [百度智能小程序](https://smartprogram.baidu.com/developer/index.html)       | `baidu`   |
| [支付宝小程序](https://open.alipay.com/channel/miniIndex.htm)              | `alipay`  |
| [字节跳动小程序](https://microapp.bytedance.com/)                           | `toutiao` |
| [QQ小程序](https://q.qq.com/)                                           | `qq`      |

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
  default:
    return 'Unknown';
}
```

> 您应该始终作为一个整体去使用 `process.env.TARGET` 。 不要把 `process` 或 `process.env` 赋值到另一个变量。

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

> **[Proposal]** 错误的配置文件可能会在某些平台引起警告。 例如，如果您在微信小程序中使用支付宝小程序的 `defaultTitle` ，可能会看到这个警告。 ![image](https://user-images.githubusercontent.com/1812118/68004991-9f61b300-fcae-11e9-9892-4797f2a9da7d.png) 为了解决这个问题，我们可以实现一个新的软件包 `@goji/config-generator` 它可以自动适配不同平台的配置文件。
