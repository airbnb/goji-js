---
sidebar_position: 5
---

# Sub Packages

Sub Packages is a common concept in most Mini Program platforms to improve load performance and code
structure. It can be regarded as chunk split in Web development.

Here are some useful links to their official documents.

- [WeChat sub packages](https://developers.weixin.qq.com/miniprogram/dev/framework/subpackages/basic.html)

- [QQ sub packages](https://q.qq.com/wiki/develop/miniprogram/frame/basic_ability/basic_pack.html)

- [Alipay sub packages](https://opendocs.alipay.com/mini/framework/subpackages)

- [Baidu sub packages](https://smartprogram.baidu.com/docs/develop/framework/subpackages/)

- [Toutiao sub packages](https://microapp.bytedance.com/docs/zh-CN/mini-app/develop/framework/subpackages/introduction)

## Problems

The original design of sub packages based code splitting result in several limitations. A sub
package cannot `require` any module in the main package nor other sub packages.

Developers have to place shared code in main package manually, otherwise they will get a compile
error from the Mini Program dev tool. In another hand, if a module was only required by a sub
package, developers should move it into the sub package to reduce size of main package.

## Hoist and nohoist

In GojiJS, we use [Webpack](https://webpack.js.org/) to analyze module dependencies and bundle the
code. With [code splitting ](https://webpack.js.org/guides/code-splitting/) we are able to import
dependents in a sub package from anywhere we want, like the main package, node_modules or even other
sub packages. GojiJS can **hoist** the shared code into a common chunk file ( usually
`_goji_commons.js` ) in the main package.

Here is an example that has 5 pages, one is in the main package and others are in 2 sub packages (
`packageA` and `packageB` ).

![sub packages example](https://user-images.githubusercontent.com/1812118/138204963-4829b600-ac1a-4273-89ab-cf36d5cd03da.png)

GojiJS hoist modules to root common chunk. By doing this the dependencies can match Mini Program sub
packages' limitations.

![hoist example](https://user-images.githubusercontent.com/1812118/138205488-dddaf015-f752-4720-90ec-b216d6f7dc27.png)

### `nohoist.enable`

`boolean = true` if in production mode, otherwise `false`.

In above example, `redux` and `date-fns` are not shared code so they can be moved into sub packages
to reduce size of main package. We call that optimization **nohoist**.

You can change `nohoist.enable` option in `goji.config.js` to toggle this feature.

> `nohoist.enable` is set to false in development mode to speed up code bundling.

![nohoist.enable example](https://user-images.githubusercontent.com/1812118/138205001-0ea82de4-81b1-494c-9e30-f48d462611be.png)

### `nohoist.maxPackages`

`number = 1`

Some modules, like `lodash` in the example, are shared only by sub packages. It is possible to
forked them into sub packages. Although the size of total packages increases, it does reduce the
size of main package.

To enable this feature, you can set `nohoist.maxPackages` to a number N above 1. A module shared
less than or equal N will be forked into `packageName/_goji_nohoist_[contenthash].js`.

![nohoist.maxPackages example](https://user-images.githubusercontent.com/1812118/138208851-2c0c7fe3-6e55-4744-b4af-b74fca59228a.png)

Although the code are duplicated, the runtime closure is still a singleton. For more details see
[Independent packages](#independent-packages).

> Please note this feature may heart user lading time because more duplicated code are generated.
> You should only use it if size of main package was exceeded or about to exceed.

### `nohoist.test`

`function (module, chunks) => boolean` `RegRex` `string`

You can use this options to nohoist specific modules.

## Independent packages

An independent package is a special case of sub packages. Only
[WeChat](https://developers.weixin.qq.com/miniprogram/dev/framework/subpackages/independent.html),
[QQ](https://q.qq.com/wiki/develop/miniprogram/frame/basic_ability/basic_pack.html#%E7%8B%AC%E7%AB%8B%E5%88%86%E5%8C%85)
and [Baidu](https://smartprogram.baidu.com/docs/develop/framework/subpackages_independent/) Mini
Program support this feature.

GojiJS support this feature in the similar way as nohoist.

First, GojiJS forks all deepened modules into `packageName/_goji_commons.js`, Then GojiJS generates
a new `packageName/_goji_runtime.js` to run load these code in the independent package and make sure
each module should has a consistent runtime closure.

To create an independent package you should add `independent: true` to `subPackages` in
`app.config.ts`.
