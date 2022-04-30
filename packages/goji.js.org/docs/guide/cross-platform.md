---
sidebar_position: 6
---

# Cross-Platform

## Supported Platforms

Goji currently support these platforms. Each target has a `target` name.

| Platform                                                                           | `target`  |
| ---------------------------------------------------------------------------------- | --------- |
| [WeChat Mini Program](https://developers.weixin.qq.com/miniprogram/dev/framework/) | `wechat`  |
| [Baidu Smart Program](https://smartprogram.baidu.com/developer/index.html)         | `baidu`   |
| [Alipay Mini Program](https://open.alipay.com/channel/miniIndex.htm)               | `alipay`  |
| [Toutiao Micro App](https://microapp.bytedance.com/)                               | `toutiao` |
| [QQ Mini Program](https://q.qq.com/)                                               | `qq`      |

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

> You should always use `process.env.TARGET` as a whole. Don't reassign `process` or `process.env`
> to another variable.

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

> **[Proposal]** Wrong config file may cause warning in some platforms. For example, if you use
> Alipay's filed `defaultTitle` in WeChat Mini Program you may see this warning.
> ![image](https://user-images.githubusercontent.com/1812118/68004991-9f61b300-fcae-11e9-9892-4797f2a9da7d.png)
> To fix this issue we can use implement a new package `@goji/config-generator` which can auto
> adjust the config files for different platforms.
