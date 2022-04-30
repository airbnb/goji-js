---
sidebar_position: 5
---

# 分包

分包加载是小程序平台的常见概念，用来优化加载性能和代码结构。 它可以被看作Web开发中的代码分割。

这里是一些有用的官方文档链接。

- [微信分包加载](https://developers.weixin.qq.com/miniprogram/dev/framework/subpackages/basic.html)

- [QQ 分包加载](https://q.qq.com/wiki/develop/miniprogram/frame/basic_ability/basic_pack.html)

- [支付宝分包加载](https://opendocs.alipay.com/mini/framework/subpackages)

- [百度分包加载](https://smartprogram.baidu.com/docs/develop/framework/subpackages/)

- [头条分包加载](https://microapp.bytedance.com/docs/zh-CN/mini-app/develop/framework/subpackages/introduction)

## 问题

原始的基于子包的代码分割设计导致了一些限制。 一个子包不能依赖（`require`）任何在主包和其他子包中的模块。

开发者必须手动将共享的代码放在主包中，否则小程序开发者工具将反馈一个编译 错误。 另一方面，如果模块只被一个子包依赖。 开发者应该将它移动到子包里，以减少主包的体积。

## Hoist 和 nohoist

在 GojiJS 中，我们使用 [Webpack](https://webpack.js.org/) 分析模块依赖关系并打包代码。 使用[代码拆分](https://webpack.js.org/guides/code-splitting/)我们可以在子包里从任何地方导入依赖， 比如主包、node_modules、甚至 其他子包。 GojiJS 可以把共享的代码 ** 提升（hoist）**到主包的公共文件（一般是 `_goji_commons.js`）。

这里是一个例子，它有五个页面，一个在主包里，其他的在两个子包里 ( `packageA` 和 `packageB`)。

![子包示例](https://user-images.githubusercontent.com/1812118/138204963-4829b600-ac1a-4273-89ab-cf36d5cd03da.png)

GojiJS 把模块提升到了根目录的公共文件。 这样做之后，就可以满足小程序分包加载的依赖限制了。

![hoist示例](https://user-images.githubusercontent.com/1812118/138205488-dddaf015-f752-4720-90ec-b216d6f7dc27.png)

### `nohoist.enable`

`boolean = true` 仅当生产模式，否则为 `false`。

在上面的例子里， `redux` 和 `date-fns` 不是共享代码，因此他们可以被移动到子包里，以减少主包的大小。 我们将这种优化叫做 ** nohoist **。

您可以更改`goji.config.js` 中的 `nohoist.enable` 选项来开启/关闭此功能。

> `nohoist.enable` 在开发模式中设置为 false，以加速代码打包。

![nohoist.enable 示例](https://user-images.githubusercontent.com/1812118/138205001-0ea82de4-81b1-494c-9e30-f48d462611be.png)

### `nohoist.maxPackages`

`number = 1`

某些模块——比如例子里的 `lodash` 只被子包内共享。 是有可能将它们复制到各个子包里的。 虽然会增大总包的体积，但的确减少了主包的体积。

要启用此功能，您可以将 `nohoist.maxPackages` 设置为大于 1 的数字 N 。 如果一个模块被小于等于 N个子包依赖，它将被复制到 `packageName/_goji_nohoist_[contenthash].js` 中。

![nohoist.maxPackages 示例](https://user-images.githubusercontent.com/1812118/138208851-2c0c7fe3-6e55-4744-b4af-b74fca59228a.png)

虽然代码被复制，但它的运行时闭包仍然是一个单例。 了解更多细节，请查看 [独立分包](#independent-packages)。

> 请注意此功能可能会因为生成更多重复的代码而损害用户加载时间。 您应当只在主包大小超出或即将超过时使用它。

### `nohoist.test`

`function (module, chunks) => boolean` `RegRex` `string`

您可以使用此字段提升特定的模块。

## 独立分包

独立分饱是一种特殊的子包。 只有 [微信](https://developers.weixin.qq.com/miniprogram/dev/framework/subpackages/independent.html)、 [QQ](https://q.qq.com/wiki/develop/miniprogram/frame/basic_ability/basic_pack.html#%E7%8B%AC%E7%AB%8B%E5%88%86%E5%8C%85) 和 [百度](https://smartprogram.baidu.com/docs/develop/framework/subpackages_independent/) 小程序支持此功能。

GojiJS 支持此功能，方法类似于 nohoist 。

首先，GojiJS 将依赖的模块复制到 `packageName/_goji_commons.js`里，然后生成新的 `packageName/_goji_runtime.js` 以在独立分包中运行这些代码，并确保每个模块应该有一致的运行时闭包。

若要创建一个独立分包，您需要在 `app.config.ts` 的`subPackages` 字段中添加 `independent: true` 。
