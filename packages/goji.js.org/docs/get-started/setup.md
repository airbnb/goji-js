---
sidebar_position: 2
---

# Setup

## Requirements

- [Node.JS](https://nodejs.org/) >= 10

- [npm](https://npmjs.com/) >= 6 or [yarn](https://yarnpkg.com/) >= 1.18

> We recommend to use [nvm](https://github.com/nvm-sh/nvm) to control the version of Node.JS

## Initialization

We recommend to initial a new Goji project by
[create-goji-app](https://www.npmjs.com/package/create-goji-app).

For npm users,

```bash
npm create goji-app my-goji-app
cd my-goji-app
npm install
```

For yarn users,

```bash
yarn create goji-app my-goji-app
cd my-goji-app
yarn
```

> The Goji project will be created in folder `my-goji-app`, you can change it if you'd like.

The project folder's structure looks like this.

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

## Start development

To start a Goji project, you can run `npm run start [target]` for development mode, or run
`npm run build [target]` for production mode.

> yarn users should run `yarn start [target]` or `yarn build [target]`

The `target` filed defaults to `wechat` and could be set to one of this list.

| Platform                                                                           | `target`  |
| ---------------------------------------------------------------------------------- | --------- |
| [WeChat Mini Program](https://developers.weixin.qq.com/miniprogram/dev/framework/) | `wechat`  |
| [Baidu Smart Program](https://smartprogram.baidu.com/developer/index.html)         | `baidu`   |
| [Alipay Mini Program](https://open.alipay.com/channel/miniIndex.htm)               | `alipay`  |
| [Toutiao Micro App](https://microapp.bytedance.com/)                               | `toutiao` |
| [QQ Mini Program](https://q.qq.com/)                                               | `qq`      |

## WeChat Mini Program

1. Run `npm run start wechat` in `my-goji-app` folder.

2. Open [WeChat Devtools](https://developers.weixin.qq.com/miniprogram/dev/devtools/download.html)
   and login by scan the QR code.

3. Import the project located at `my-goji-app/dist/wechat`. You should correct the `appid` according
   to your real project or just use a
   [test account](https://developers.weixin.qq.com/miniprogram/dev/devtools/sandbox.html).

![image](https://user-images.githubusercontent.com/1812118/86796292-05ee6a80-c0a1-11ea-9c4c-f302c70f5d17.png)

4. You should see the demo project. The dev tool will auto-reload if any source code changed.

![image](https://user-images.githubusercontent.com/1812118/86796712-739a9680-c0a1-11ea-95fd-14178361fff6.png)

After developing the code, you can run `npm run build wechat` to bundle the code and then preview or
upload the mini program. Please note uploading code requires a real `appid` rather than a test
account.

## Other mini program

Basically the steps are same as WeChat Mini Program. You should download the different dev tools
from their official website.
