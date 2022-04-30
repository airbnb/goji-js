---
sidebar_position: 3
---

# Plugins

Some platforms like WeChat and Baidu provide a way to wrap and reuse JS code, components and pages
on mini programs.

Before reading next sections, we advice you to learn these official documentations.

- [WeChat `plugins`](https://developers.weixin.qq.com/miniprogram/dev/framework/plugin/)
- [Baidu `dynamicLib`](https://smartprogram.baidu.com/docs/develop/framework/dynamiclib_use/)

GojiJS enables the ability to import and use plugin/dynamicLib in React code.

> For now, GojiJS doesn't support writing plugins.

## Import a plugin

At first, you need to add some meta data in the `app.config.ts` file. You can use param `target` to
detect platform.

Here is an example to show how to enable different plugin in the same GojiJS app.

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

## Use components

To enable plugin components, you need to make sure `@goji/macro` package is installed.

```bash
yarn add @goji/macro
```

`@goji/macro` exports a API called `registerPluginComponent` that accepts these params.

```tsx
function registerPluginComponent(
  target: GojiTarget,
  name: string,
  path: string,
  props: Array<string | [string, PropDesc]>,
): React.FunctionComponent<any>;
```

- `target`: On which platform this component could work. An empty component will be rendered on
  other platforms.
- `name`: The component name generated in `usingComponents`, should be unique and not equal to any
  built-in component, for example `<my-component-name>` is valid and `<view>` is invalid.
- `path`: The component path generated in `usingComponents`, should start with `plugin://` or
  `dynamicLib://`.
- `props`: Properties should be defined manually before using. For example,
  `props: ['a', ['b', { defaultValue: '100' }]]` let GojiJS generate template like this
  `<my-component-name a="{{props.a}}" b="{{props.b === undefined ? 100 : props.b}}">`.

`registerPluginComponent` returns a React component that you can use as normal.

Here is a full example of
[Baidu sitemap component](https://smartprogram.baidu.com/docs/develop/framework/sitemap/).

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

## Use pages

Use `wx.navigate` API or `Navigator` component to navigate to a page in plugin.

```tsx
import { Navigator } from '@goji/core';

<Navigator url="plugin://myPlugin/hello-page">WeChat</Navigator>;

<Navigator url="dynamicLib://dynamicLibName/pages/index/index">Baidu</Navigator>;
```

## Use JS API

Use `requirePlugin` or `requireDynamicLib` directly.

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
