---
sidebar_position: 3
---

# 使用插件

一些平台（如微信和百度）提供了一种在小程序上封装和复用使用JS代码、组件和页面的方法。

在阅读下一节之前，我们建议你先学习一下这些官方文档。

- [微信 `插件`](https://developers.weixin.qq.com/miniprogram/dev/framework/plugin/)
- [百度 `动态库`](https://smartprogram.baidu.com/docs/develop/framework/dynamiclib_use/)

GojiJS 提供了在 React 代码中导入和使用插件/动态库的能力。

> 目前 GojiJS 不支持编写插件。

## 导入插件

首先，你需要在 `app.config.ts` 文件中添加一些元数据。 你可以使用 `target` 参数来检测平台。

这是一个例子，展示了如何在同一个 GojiJS 应用中启用不同的插件。

```tsx
export default ({ target }: { target: GojiTarget }) => {
  const enableLivePlayer = target === 'wechat';
  const enableSwanSitemap = target === 'baidu';

  return {
    ...(enableLivePlayer && {
      plugins: {
        'live-player-plugin': {
          version: '1.2.10',
          provider: 'wx2b03c6e691cd7370',
        },
      },
    }),
    ...(enableSwanSitemap && {
      dynamicLib: {
        'swan-sitemap-lib': {
          provider: 'swan-sitemap',
        },
      },
    }),
  };
};
```

## 使用组件

要启用插件组件，你需要确认安装 `@goji/macro` 包。

```bash
yarn add @goji/macro
```

`@goji/macro` 导出了一个名为 `registerPluginComponent` 的API，它接受这些参数：

```tsx
function registerPluginComponent(
  target: GojiTarget,
  name: string,
  path: string,
  props: Array<string | [string, PropDesc]>,
): React.FunctionComponent<any>;
```

- `target`：此组件应当在哪个平台上运行。 在其他平台上将渲染一个空组件.
- `name`：生成到 `usingComponents`里的组件名，应该是唯一的，不能与任何内置组件相同。 例如 `<my-component-name>` 是合法的, `<view>` 是不合法的。
- `path`：生成到 `usingComponents`里的组件路径，应以 `plugin://` 或 `dynamicLib://` 开头。
- `props`：在使用组件前需要手动定义属性。 例如， `props: ['a', ['b', { defaultValue: '100' }]]` 会让 GojiJS 生成类似于这样的组件 `<my-component-name a="{{props.a}}" b="{{props.b === undefined ? 100 : props.b}}">`.

`registerPluginComponent` 返回一个可以正常使用的React组件。

这里是一个 [百度sitemap](https://smartprogram.baidu.com/docs/develop/framework/sitemap/) 的完整例子。

```tsx
import { registerPluginComponent } from '@goji/macro';

const SwanSitemapList = registerPluginComponent(
  'baidu',
  'swan-sitemap-list',
  'dynamicLib://swan-sitemap-lib/swan-sitemap-list',
  ['list-data', 'current-page', 'total-page', 'path'],
);

const listData = [
  {
    title: 'GojiJS',
    path: '/packageA/pages/details?id=1',
    releaseDate: '2021-1-1 00-00-00',
  },
  {
    title: 'Powered by',
    path: '/packageA/pages/details?id=2',
    releaseDate: '2021-1-2 00-00-00',
  },
  {
    title: 'Airbnb',
    path: '/packageA/pages/details?id=3',
    releaseDate: '2021-1-3 00-00-00',
  },
];

render(
  <SwanSitemapList
    listData={listData}
    currentPage={1}
    totalPage={500}
    path="/swan-sitemap/index"
  />,
);
```

## 使用页面

使用 `wx.navigate` API 或 `Navigator` 组件跳转到插件中的页面。

```tsx
import { Navigator } from '@goji/core';

<Navigator url="plugin://myPlugin/hello-page">WeChat</Navigator>;

<Navigator url="dynamicLib://dynamicLibName/pages/index/index">Baidu</Navigator>;
```

## 使用 JS API

直接使用 `requirePlugin` 或 `requireDynamicLib`即可。

```tsx
if (process.env.GOJI_TARGET === 'wechat') {
  const myPluginInterface = requirePlugin('myPlugin');
  myPluginInterface.hello();
}
if (process.env.GOJI_TARGET === 'baidu') {
  const lib = requireDynamicLib('myDynamicLib');
  lib.getData();
}
```
