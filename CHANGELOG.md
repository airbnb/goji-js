# Change Log

# v.1.3.1 (2024-10-22)

### Bugfixes

- **cli:** Replace Linaria preprocessor with postcss to fix an error of postcss-transform-unit
  [\#241](https://github.com/airbnb/goji-js/pull/241)
- **cli:** Fix Webpack cache invalidation [\#230](https://github.com/airbnb/goji-js/pull/230)
- **core:** Move `instance.registerEventHandler` from `createInstance` to `commitMount` in the React
  reconciler host config [\#229](https://github.com/airbnb/goji-js/pull/229)
- **docs:** Add documentation for `goji.config.js`
  [\#228](https://github.com/airbnb/goji-js/pull/228)
- **webpack-plugin:** Upgrade latest webpack@5.89.0
  [\#227](https://github.com/airbnb/goji-js/pull/227)

### Features

- **core:** Support picker-view-column component [\#250](https://github.com/airbnb/goji-js/pull/250)
- **webpack-plugin:** Refactor CSS unit transforming
  [\#231](https://github.com/airbnb/goji-js/pull/231)

# v.1.3.0 (2023-11-14)

### Bugfixes

- **core:** Use `event.timestamp` as an alist for `event.timeStamp`
  [\#209](https://github.com/airbnb/goji-js/pull/209)

- **webpack-plugin:** Remove bugfix for \#160 [\#211](https://github.com/airbnb/goji-js/pull/211)

- **webpack-plugin:** Enable wrapper for \<scroll-view\> on Baidu
  [\#212](https://github.com/airbnb/goji-js/pull/212)

- **webpack-plugin:** Prevent using `<include>` in `<template>` to fix \#140 on Alipay
  [\#213](https://github.com/airbnb/goji-js/pull/213)

- **create-goji-app** Disable code protect option for wechat and qq
  [\#217](https://github.com/airbnb/goji-js/pull/217)

### Features

- **testing-library** support fire load and error event in test library
  [\#214](https://github.com/airbnb/goji-js/pull/214) ([race604](https://github.com/race604))

- **webpack-plugin:** Enable `nohoist` by default
  [\#223](https://github.com/airbnb/goji-js/pull/223)

- **webpack-plugin:** Add `parallel` option in goji.config.js
  [\#224](https://github.com/airbnb/goji-js/pull/224)

# v.1.2.0 (2023-07-11)

### Bugfixes

- **webpack-plugin:** Inline the content of `children.wxml` into `component.wxml` to support new
  Baidu compiler on dev tool >= v4.22 [\#206](https://github.com/airbnb/goji-js/pull/206)

# v1.1.1 (2023-04-22)

### Bugfixes

- **webpack-plugin:** Fix an issue of Baidu flatten text template that cause missing text on
  production mode [\#192](https://github.com/airbnb/goji-js/pull/192)

- **core:** Update props of \<scroll-view\> [\#199](https://github.com/airbnb/goji-js/pull/199)

- **core:** Refactor `stopPropagation` to fix \#198
  [\#202](https://github.com/airbnb/goji-js/pull/202)

# v1.1.0 (2022-12-06)

### Features

- **webpack-plugin:** Enable wrapped input/textarea for baidu
  [\#165](https://github.com/airbnb/goji-js/pull/165)

- **webpack-plugin:** Refactored the data structure in template and `setData` JSON data.
  [\#180](https://github.com/airbnb/goji-js/pull/180)

- **webpack-plugin:** Refactor ComponentDesc [\#181](https://github.com/airbnb/goji-js/pull/181)

- **webpack-plugin:** Refactor wrapped component with `meta`
  [\#182](https://github.com/airbnb/goji-js/pull/182)

- **core:** Support NodeJS 18 [\#184](https://github.com/airbnb/goji-js/pull/184)

- **webpack-plugin:** Refactor template reuse & fix `getSubtreeId`
  [\#186](https://github.com/airbnb/goji-js/pull/186)

### Bugfixes

- **create-goji-app:** Remove default `libVersion` fields in `project.config.json`
  [\#164](https://github.com/airbnb/goji-js/pull/164)

- **cli:** Upgrade deps & fix missing linaria issue in create CLI template
  [\#175](https://github.com/airbnb/goji-js/pull/175)

### Misc.

- **docs:** Upgrade docs to docusaurus v2 [\#166](https://github.com/airbnb/goji-js/pull/166)

- **docs:** Add missing CNAME file for docs [\#170](https://github.com/airbnb/goji-js/pull/170)

# v1.0.1 (2022-04-13)

### Features

- **cli:** Support React Native's global variable `__DEV__`
  [#157](https://github.com/airbnb/goji-js/pull/157)

### Bugfixes

- **webpack-plugin:** Fix toutiao calc issue [#161](https://github.com/airbnb/goji-js/pull/161)

# v1.0.0 (2022-02-22)

### Features

- **core:** Support React 17 [#90](https://github.com/airbnb/goji-js/pull/90)

- **cli:** Upgrade to Webpack 5 [#22](https://github.com/airbnb/goji-js/pull/22)

- **linaria:** Support Linaria 2 [#42](https://github.com/airbnb/goji-js/pull/42)

- **testing-library:** Support Testing Library

- **cli:** Support `nohoist` option to reduce main package bundle size
  [#120](https://github.com/airbnb/goji-js/pull/120)
