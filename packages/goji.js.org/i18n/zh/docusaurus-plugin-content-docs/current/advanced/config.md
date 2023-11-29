---
sidebar_position: 1
---

# 项目配置

通常 GojiJS 是开箱即用的，但如果你想自定义构建的过程和结果，可以使用 `goji.config.js` 文件。

## 示例

配置文件的示例如下所示：

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

## 选项 - 打包工具

### `progress`

- 类型: `boolean | undefined`

- 默认值: `true`

启用、禁用 GojiJS CLI 进度输出的布尔值。

### `watch`

- 类型: `boolean | undefined`

- 默认值：开发模式下为 `true`，生产模式下为 `false`。

启用、禁用 GojiJS CLI 监听模式的布尔值。

### `outputPath`

- 类型: `string | undefined`

- 默认值: `[basedir]/dist/[target]`

GojiJS CLI 的输出路径。 默认的文件结构像这样：

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

- 类型: `undefined | number | { loader?: number; minimize?: number }`

- 默认值: `undefined`

一个数字或对象用于启用、禁用 GojiJS CLI 的并行模式。 你可以使用 `number` 来指定并行任务的数量。 你也可以使用一个对象来指定每个阶段的并行数量。

### `parallel.loader`

- 类型: `number | undefined`

- 默认值：基于CPU核心数的值。

等于 [thread-loader](https://webpack.js.org/loaders/thread-loader/) 的 `workers` 选项的数量加 `1`。

> 请注意，过多的并行任务可能会消耗过多的资源，甚至会降低性能。 参见
> [阿姆达尔定律](https://zh.wikipedia.org/wiki/%E9%98%BF%E5%A7%86%E8%BE%BE%E5%B0%94%E5%AE%9A%E5%BE%8B)。

> 因此，如果 `parallel.loader` 是 `undefined`， `workers` 的最大值为 3。

### `parallel.minimize`

- 类型: `number | undefined`

- 默认值：基于CPU核心数的值。

等价于 [TerserWebpackPlugin](https://webpack.js.org/plugins/terser-webpack-plugin/#parallel) 的 `parallel` 参数。

### `configureBabel`

- 类型: `undefined | (config: any) => undefined`

一个用于定制 GojiJS 内部的 Babel 配置的函数。

`config` 是 [Babel 的配置对象](https://babeljs.io/docs/zh/config-files)。

```js
module.exports = {
  configureBabel: config => {
    config.plugins.push('babel-plugin-xxx');
  },
};
```

### `configureWebpack`

- 类型: `undefined | (config: webpack.Configuration, webpackInGoji: typeof webpack) => undefined`

一个用于定制 GojiJS 内部的 Webpack 配置的函数。

`config` 参数是 [Webpack 的配置对象](https://webpack.js.org/configuration/)，你可以直接修改它。

```js
module.exports = {
  configureWebpack: (config, webpack) => {
    config.plugins.push(new OtherWebpackPlugin());
  },
};
```

`webpackInGoji` 参数是 Webpack 的实例。 在某些情况下，您可能希望使用它的字段和方法。

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

## 选项 - 优化输出

### `nohoist`

在 GojiJS 中，我们利用 [Webpack](https://webpack.js.org/) 来分析模块依赖并打包代码。 通过 [代码分割](https://webpack.js.org/guides/code-splitting/)， 我们可以在[子包](https://developers.weixin.qq.com/miniprogram/dev/framework/subpackages/basic.html)中从多处引入依赖，包括主包，`node_modules`，或者其他子包。 GojiJS 可以将共享的代码**提升**到主包中的一个公共块文件（通常为 `\_goji_commons.js`）里。

这有一个例子，它有5个页面，其中一个在主包中，其他的分布在两个子包（`packageA` 和 `package`）中。

![子包示例](https://user-images.githubusercontent.com/1812118/138204963-4829b600-ac1a-4273-89ab-cf36d5cd03da.png)

在 GojiJS 中，模块被提升到根公共块中。 这种方式确保了依赖关系符合小程序子包的限制。

### `nohoist.enable`

- 类型: `boolean | undefined`

- 默认值：在生产模式下为 `true`，其他情况下为 `false`。

在上述例子中，`redux` 和 `date-fns` 不被视为共享代码，因此它们可以移动到子包中，从而减小主包的大小。 这种优化被称为**不提升（nohoist）**。

要启用此功能，您可以将 `nohoist.enable` 选项设置为 `true`。

### `nohoist.maxPackages`

- 类型: `number | undefined`

- 默认值: `1`

有些模块，比如例子中的 `lodash`，只被子包共享。 可以将它们复制到子包中。 虽然这增加了总体包的大小，但有效地减少了主包的大小。

要启用此功能，您可以将 `nohoist.maxPackages` 设置为大于1的数字 N。 被少于或等于 N 的包共享的模块将被复制到 `packageName/_goji_nohoist_[contenthash].js` 中。

![nohoist.maxPackages 示例](https://user-images.githubusercontent.com/1812118/138208851-2c0c7fe3-6e55-4744-b4af-b74fca59228a.png)

即使代码是重复的，运行时闭包仍然是单例的。

此功能还支持[独立分包](https://developers.weixin.qq.com/miniprogram/dev/framework/subpackages/independent.html)。

> 请注意，由于生成了更多的重复代码，此功能可能会影响用户的加载时间。 只有在主包的大小已经超过或即将超过限制时，才应该使用此功能。

### `nohoist.test`

- 类型:
  `undefined | string | RegExp | ((module: webpack.Module, chunks: Array<webpack.Chunk>) => boolean)`

- 默认值: `undefined`

您可以使用此选项来取消特定模块的提升。

### `css`

该选项可配置 CSS 的处理过程。

### `css.unit`

- 类型: `undefined | 'keep' | 'to-px' | 'to-rpx'`

- 默认值: `'to-rpx'`

GojiJS 有一个内置的 PostCSS 插件叫做 [postcss-transform-unit](https://github.com/airbnb/goji-js/pull/231)，它可用来转换所有文件中的 CSS 单位。 在某些情况下，您可能想要将 px`的用法转换为`rpx\` ，反之亦然。 您可以使用此选项。

- `keep`: 不转换任何 CSS 单位。

- `to-px`: 将 `rpx` 转换为 `px` 。 `2rpx`等于`1px`。

- `to-rpx`: 将 `px` 转换为 `rpx` 。 `1px`等于`2rpx`。

> 默认值将在将来更改为 "keep"
