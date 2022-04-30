---
sidebar_position: 2
---

# 安装

## 要求

- [Node.JS](https://nodejs.org/) >= 10

- [npm](https://npmjs.com/) >= 6 或 [yarn](https://yarnpkg.com/) >= 1.18

> 我们建议使用 [nvm](https://github.com/nvm-sh/nvm) 来控制Node.JS 版本

## 初始化

我们建议通过 [create-goji-app](https://www.npmjs.com/package/create-goji-app) 来创建一个新的 Goji 项目。

对于 npm 用户，

```bash
npm create goji-app my-goji-app
cd my-goji-app
npm install
```

对于 yarn 用户，

```bash
yarn create goji-app my-goji-app
cd my-goji-app
yarn
```

> Goji项目将创建在文件夹 `my-goji-app`中，你可以按照自己的意愿修改它。

项目文件夹的结构看起来是这样的。

```
my-goji-app/
├── goji.config.js
├── package.json
└── src
    ├── app.config.ts
    ├── app.css
    ├── app.ts
    ├── pages
    │   └── index
    │       ├── index.config.ts
    │       ├── index.css
    │       └── index.tsx
    └── project.config.json
```

## 开始开发

要启动一个 Goji 项目，您可以运行 `npm run start [target]` 开启开发模式， 或运行 `npm run build [target]` 开启生产模式。

> yarn 用户应该运行 `yarn start [target]` 或 `yarn build [target]`

`target` 默认情况下为 `wechat`， 可以为此列表中的任意一个。

| 平台                                                                   | `target`  |
| -------------------------------------------------------------------- | --------- |
| [微信小程序](https://developers.weixin.qq.com/miniprogram/dev/framework/) | `wechat`  |
| [百度智能小程序](https://smartprogram.baidu.com/developer/index.html)       | `baidu`   |
| [支付宝小程序](https://open.alipay.com/channel/miniIndex.htm)              | `alipay`  |
| [字节跳动小程序](https://microapp.bytedance.com/)                           | `toutiao` |
| [QQ小程序](https://q.qq.com/)                                           | `qq`      |

## 微信小程序

1. 在运行`my-goji-app` 文件夹中运行 `npm run start wechat`。

2. 打开 [微信开发者工具](https://developers.weixin.qq.com/miniprogram/dev/devtools/download.html)， 并扫描二维码登录。

3. 导入位于 `my-goji-app/dist/wechat` 的项目。 您应该根据真实项目修改 `appid` ，或者直接使用 [测试账户](https://developers.weixin.qq.com/miniprogram/dev/devtools/sandbox.html)。

![image](https://user-images.githubusercontent.com/1812118/86796292-05ee6a80-c0a1-11ea-9c4c-f302c70f5d17.png)

4. 你应该可以看到示例项目。 如果源代码被修改，开发者工具会自动重新加载。

![image](https://user-images.githubusercontent.com/1812118/86796712-739a9680-c0a1-11ea-95fd-14178361fff6.png)

在代码开发完成后， 您可以运行 `npm run build wechat` 来打包代码，然后预览或 上传小程序。 请注意上传代码需要真实的 `appid` 而不是测试帐户。

## 其他小程序

基本上步骤与微信小程序相同。 您应该从官方网站下载不同的开发者工具。
