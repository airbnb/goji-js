## Architecture

![image](https://user-images.githubusercontent.com/1812118/62456261-9f830d00-b7aa-11e9-9d8d-8558bf890620.png)

Goji is inspired from [fard](https://github.com/132yse/fard) and [remax](https://github.com/remaxjs/remax).

This picture shows the architecture of the fard.

![](https://ae01.alicdn.com/kf/HTB1hkZ2Xlv0gK0jSZKbq6zK2FXax.jpg)

And here is an article about fard: [fard：fre 转小程序的新思路](https://zhuanlan.zhihu.com/p/70363354)

## How to contribute

Since `goji` uses monorepo managed by [lerna](https://github.com/lerna/lerna) you should install `lerna` at first.

```bash
npm i -g lerna
```

Then install all dependencies:

```bash
yarn
```

> For more details of how to use Lerna see [the official documents](https://lerna.js.org/).

For example, run these commands if you'd like to run `goji-demo-webpack` with Webpack:

```bash
cd packages/demo-webpack
yarn build
```

## How to publish

```bash
yarn
lerna publish
```
