---
sidebar_position: 1
---

# App

## App config

Each Mini Program has an `app.json` as the main entry.

Here is a demo of `app.json`.

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

For more fields, see
[here](https://developers.weixin.qq.com/miniprogram/dev/reference/configuration/app.html) .

In addition, Goji provides a JavaScript-based config file called `app.config.js`. You can use it for
better [cross-platform](./cross-platform.md) support.

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

## App script

Same as original
[app.js](https://developers.weixin.qq.com/miniprogram/dev/framework/app-service/app.html). You can
add global polyfills in this file.

```ts
import 'core-js';

App({});
```
