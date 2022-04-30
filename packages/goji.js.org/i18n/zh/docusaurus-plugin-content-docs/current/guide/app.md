---
sidebar_position: 1
---

# 入口

## 应用配置

每一个小程序都拥有一个`app.json`作为主入口。

这里是一个 `app.json` 的例子。

```json
{
  "pages": ["pages/index/index", "pages/benchmark/index"],
  "window": {
    "backgroundTextStyle": "dark",
    "navigationBarBackgroundColor": "#001935",
    "navigationBarTitleText": "Goji",
    "navigationBarTextStyle": "white"
  }
}
```

更多字段请见[这里](https://developers.weixin.qq.com/miniprogram/dev/reference/configuration/app.html)。

此外，Goji提供了一种基于 JavaScript 的配置文件，名为 `app.config.js`。 您可以使用它获得更好的 [跨平台](./cross-platform.md) 支持。

```js
module.exports = ({ target }) => ({
  pages: ['pages/index/index', 'pages/benchmark/index'],
  window: {
    backgroundTextStyle: 'dark',
    navigationBarBackgroundColor: '#001935',
    navigationBarTitleText: `Goji on ${target}`,
    navigationBarTextStyle: 'white',
  },
});
```

## 应用代码

与原生的[app.js](https://developers.weixin.qq.com/miniprogram/dev/framework/app-service/app.html) 相同。 您可以在这个文件添加全局polyfills。

```ts
import 'core-js';

App({});
```
