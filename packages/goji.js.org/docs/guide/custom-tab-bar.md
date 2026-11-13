---
sidebar_position: 7
---

# Custom TabBar

GojiJS supports WeChat's
[custom tabBar](https://developers.weixin.qq.com/miniprogram/dev/framework/ability/custom-tabbar.html),
which lets you render the tab bar with React instead of the native one.

## Enable it

Add `tabBar.custom: true` and the complete `tabBar.list` to `app.config.ts`. The `list` is still
required because the Mini Program uses it to tell which pages are tab pages, even though it isn't
rendered natively.

```ts
import { GojiTarget } from '@goji/core';

export default ({ target }: { target: GojiTarget }) => ({
  pages: ['pages/index/index', 'pages/me/index'],
  ...(target === 'wechat'
    ? {
        tabBar: {
          custom: true,
          color: '#777777',
          selectedColor: '#af2f2f',
          backgroundColor: '#ffffff',
          list: [
            { pagePath: 'pages/index/index', text: 'Index' },
            { pagePath: 'pages/me/index', text: 'Me' },
          ],
        },
      }
    : {}),
});
```

Once enabled, GojiJS generates the `custom-tab-bar/index` component from your source file, so you
must **not** write `custom-tab-bar/index.wxml` or `custom-tab-bar/index.wxss` manually — they are
overwritten by the build.

Custom tabBar is only supported on WeChat so far. On other targets `tabBar.custom` is ignored with a
warning and the native tabBar is used, so remember to guard it by `target` as shown above.

The build fails with a readable error if `custom-tab-bar/index` is missing, and also if a tab page
in `tabBar.list` is not listed in `pages`.

## Write the component

Create `src/custom-tab-bar/index.tsx` and render it with `{ type: 'component' }` rather than as a
page:

```tsx
import React from 'react';
import { View, render, useTabBar } from '@goji/core';

const TabBar = () => {
  const { list, selected, switchTab } = useTabBar();
  return (
    <View className="tab-bar">
      {list.map((item, index) => (
        <View
          key={item.pagePath}
          className={`tab-item${index === selected ? ' tab-item-selected' : ''}`}
          onTap={() => switchTab(index)}
        >
          {item.text}
        </View>
      ))}
    </View>
  );
};

render(<TabBar />, { type: 'component' });
```

## `useTabBar`

`useTabBar()` returns:

- `list`: the `tabBar.list` from `app.config.ts`, injected at build time.
- `selected`: the index of the current tab, derived from the route of the host page. It's updated
  automatically when a page shows, so you never need to call `getTabBar().setData()` from your
  pages.
- `switchTab(index)`: navigates to the tab page with `wx.switchTab`.

Since the selected tab is derived from the route, each tab page owns its own tabBar instance and
there is no state to sync between pages.

## Icons

`tabBar.list[].iconPath` and `selectedIconPath` are handled by the Mini Program only for the native
tabBar. In the custom tabBar they are **not** available from `useTabBar()`, because those files are
emitted as hashed webpack assets (`assets/icon.1b627c.png`) and the raw path in `app.config.ts` is
not valid at runtime. GojiJS drops these fields and prints a warning if they are set.

Load icons with `import` in your component and keep the order in sync with `tabBar.list`:

```tsx
import iconTodo from '../image/todo.png';
import iconTodoHL from '../image/todo_HL.png';
import iconAbout from '../image/about.png';
import iconAboutHL from '../image/about_HL.png';

const ICONS = [
  { icon: iconTodo, selectedIcon: iconTodoHL },
  { icon: iconAbout, selectedIcon: iconAboutHL },
];

const iconStyle = css`
  width: 54rpx;
  height: 54rpx;
`;
```

`import` of images works out of the box — `create-goji-app` includes a `global.d.ts` declaring
`*.png` / `*.jpg` / `*.gif` modules for TypeScript. If your project predates it, add that file
manually.

## Styling

The custom tabBar is a custom component. GojiJS sets `addGlobalClass` so global styles from
`app.css` still apply, and `_goji_commons.wxss` is imported automatically.

Remember to reserve space for the home indicator on iOS devices, otherwise the tabBar will be
covered by it:

```css
.tab-bar {
  padding-bottom: env(safe-area-inset-bottom);
}
```

WeChat recommends `cover-view` for the tabBar so it stays above other elements, and if you use the
`skyline` renderer the root element also needs:

```css
.tab-bar {
  position: absolute;
  pointer-events: auto;
}
```
