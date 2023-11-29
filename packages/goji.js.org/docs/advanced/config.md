---
sidebar_position: 1
---

# Project Config

Normally GojiJS works out of the box, but if you want to customize the build process and result, you
can use the `goji.config.js` file.

## Example

An example of the configuration file looks like this:

```js
// `goji.config.js`

module.exports = {
  progress: true,
  watch: true,
  outputPath: path.join(__basedir, 'dist'),
  nohoist: {
    maxPackages: 3,
  },
  parallel: {
    loader: 4,
    minimize: 4,
  },
};
```

## Options - bundle tooling

### `progress`

- Type: `boolean | undefined`

- Default: `true`

A boolean value to enable/disable the progress output of GojiJS CLI.

### `watch`

- Type: `boolean | undefined`

- Default: `true` on development mode and `false` on production mode.

A boolean value to enable/disable the watch mode of GojiJS CLI.

### `outputPath`

- Type: `string | undefined`

- Default: `[basedir]/dist/[target]`

The output path of GojiJS CLI. The default folder structure is like this:

```
.
├── dist
│   ├── alipay
│   ├── baidu
│   ├── qq
│   ├── toutiao
│   └── wechat
└── src
```

### `parallel`

- Type: `undefined | number | { loader?: number; minimize?: number }`

- Default: `undefined`

A number or an object to enable/disable the parallel mode of GojiJS CLI. You can use `number` to
specify the number for overall parallel jobs. You can also use an object to specify the number for
each parallelizable stage.

### `parallel.loader`

- Type: `number | undefined`

- Default: value based on the number of CPU cores.

It equals to the number `workers` option of
[thread-loader](https://webpack.js.org/loaders/thread-loader/) plus `1`.

> Note that too many parallel jobs may cost too much resources and even slow down performance. See
> [Amdahl's law](https://en.wikipedia.org/wiki/Amdahl%27s_law).

> So we set a maximum of `workers` to 3 if `parallel.loader` is `undefined`.

### `parallel.minimize`

- Type: `number | undefined`

- Default: value based on the number of CPU cores.

The `parallel` option of
[TerserWebpackPlugin](https://webpack.js.org/plugins/terser-webpack-plugin/#parallel).

### `configureBabel`

- Type: `undefined | (config: any) => undefined`

A function to configure the Babel config inside GojiJS.

`config` is the [Babel's config object](https://babeljs.io/docs/en/config-files).

```js
module.exports = {
  configureBabel: config => {
    config.plugins.push('babel-plugin-xxx');
  },
};
```

### `configureWebpack`

- Type: `undefined | (config: webpack.Configuration, webpackInGoji: typeof webpack) => undefined`

A function to configure the Webpack config inside GojiJS.

The `config` parameter is the [Webpack's config object](https://webpack.js.org/configuration/) that
you can modify it directly.

```js
module.exports = {
  configureWebpack: (config, webpack) => {
    config.plugins.push(new OtherWebpackPlugin());
  },
};
```

The `webpackInGoji` parameter is the instance of Webpack. In some cases, you may want to use the
fields/methods from it.

```js
module.exports = {
  configureWebpack: (config, webpack) => {
    config.plugins.push(
      new webpack.DefinePlugin({
        MY_ENV: 'hello world',
      }),
    );
  },
};
```

## Options - output optimizations

### `nohoist`

In GojiJS, we utilize [Webpack](https://webpack.js.org/) to analyze module dependencies and bundle
the code. Through [code splitting](https://webpack.js.org/guides/code-splitting/), we can import
dependencies in a
[subpackage](https://developers.weixin.qq.com/miniprogram/dev/framework/subpackages/basic.html) from
various locations, such as the main package, ` node_modules`, or even other subpackages. GojiJS can
**hoist** the shared code into a common chunk file (usually `\_goji_commons.js`) in the main
package.

Here is an example with 5 pages, where one is in the main package, and the others are in two
subpackages (`packageA` and `packageB`).

![sub packages example](https://user-images.githubusercontent.com/1812118/138204963-4829b600-ac1a-4273-89ab-cf36d5cd03da.png)

In GojiJS, modules are hoisted to the root common chunk. This approach ensures that dependencies
align with the limitations of Mini Program subpackages.

### `nohoist.enable`

- Type: `boolean | undefined`

- Default: `true` in production mode and `false` otherwise.

In the above example, `redux` and `date-fns` are not considered shared code, so they can be moved
into subpackages to reduce the size of the main package. This optimization is referred to as
**nohoist**.

To enable this feature, you can set the `nohoist.enable` option to `true`.

### `nohoist.maxPackages`

- Type: `number | undefined`

- Default: `1`

Some modules, such as `lodash` in the example, are shared only by subpackages. It is possible to
fork them into subpackages. While this increases the size of the total packages, it effectively
reduces the size of the main package.

To enable this feature, you can set `nohoist.maxPackages` to a number N greater than 1. A module
shared less than or equal to N will be forked into `packageName/_goji_nohoist_[contenthash].js`.

![nohoist.maxPackages example](https://user-images.githubusercontent.com/1812118/138208851-2c0c7fe3-6e55-4744-b4af-b74fca59228a.png)

Even though the code is duplicated, the runtime closure remains a singleton.

This feature also works with
[independent packages](https://developers.weixin.qq.com/miniprogram/dev/framework/subpackages/independent.html).

> Please note that this feature may impact user loading time because more duplicated code is
> generated. It should only be used if the size of the main package has exceeded or is about to
> exceed the limit.

### `nohoist.test`

- Type:
  `undefined | string | RegExp | ((module: webpack.Module, chunks: Array<webpack.Chunk>) => boolean)`

- Default: `undefined`

You can use this options to nohoist specific modules.

### `css`

Options to configure the processing of styles.

### `css.unit`

- Type: `undefined | 'keep' | 'to-px' | 'to-rpx'`

- Default: `'to-rpx'`

There is a built-in PostCSS plugin called
[postcss-transform-unit](https://github.com/airbnb/goji-js/pull/231) that can be used to transform
CSS units in all files. In some cases, you may want to convert the usage of `px` to `rpx` or vice
versa. You can use this option.

- `keep`: Do not transform any CSS unit.

- `to-px`: Transform `rpx` to `px`. `2rpx` equals to `1px`.

- `to-rpx`: Transform `px` to `rpx`. `1px` equals to `2rpx`.

> The default will be changed to `keep` in the future.
