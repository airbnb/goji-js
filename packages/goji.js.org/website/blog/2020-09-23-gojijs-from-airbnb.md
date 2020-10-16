---
title: GojiJS——来自Airbnb的小程序跨平台解决方案
author: Chong Ma
authorURL: http://github.com/malash
authorImageURL: https://avatars2.githubusercontent.com/u/1812118?s=460&v=4
---

> 作者：Chong Ma，Airbnb 中国工程师

> 校对：Xijin Liu，Airbnb 中国工程经理；Lang Yang，Airbnb 中国工程经理


# GojiJS 是什么

GojiJS 是由 Airbnb（爱彼迎）开发的小程序前端框架，在公司内部经历近一年的内测，支撑了公司各个平台小程序的业务，最终于2020年06月正式开源。

它的目的是让开发者在各种小程序平台上获得统一的 React 开发体验。GojiJS 完整支持最新版 React 的常见功能——包括高阶组件（HOC）、Hooks、Suspense 等功能，并且支持微信、百度、支付宝、QQ、头条等小程序的跨平台开发。

相比于Web开发，小程序是一个特殊的平台，它本身存在着种种限制和问题，为了实现跨平台的目标，GojiJS 主要提供了两个模块：`@goji/core` 是基于 React 的前端框架，提供了原生组件、生命周期、事件响应等API，运行在小程序 JavaScript 环境中；`@goji/cli` 提供了必要的编译工具和命令行工具，并支持 CSS Module、Polyfill、代码打包优化等功能。这两者一起为小程序开发者提供了开箱即用的完整解决方案。

想要了解 GojiJS 的更多信息，可以访问 [GojiJS 仓库](https://github.com/airbnb/goji-js) 。

# 快速开始

GojiJS 提供了类似于 create-react-app 的全家桶工具，叫做 [create-goji-app](https://www.npmjs.com/package/create-goji-app)。在 NPM >= 5 中，使用 `npm create goji-app` 命令即可运行它：

```bash
npm create goji-app my-goji-app
cd my-goji-app
npm install
```

> GojiJS 需要 Node.JS >= 10 ，npm >= 6 或 yarn >= 1.18

一个标准的 GojiJS 项目结构大概是这样的：

```
my-goji-app/
├── goji.config.js
├── package.json
└── src
    ├── app.config.ts
    ├── app.css
    ├── app.ts
    ├── pages
    │   └── index
    │       ├── index.config.ts
    │       ├── index.css
    │       └── index.tsx
    └── project.config.json
```

使用 `npm run start wechat` 即可监听并编译微信小程序，使用小程序开发者工具打开 `dist/wechat` 目录即可预览。

更多安装细节可以参见[安装](https://goji.js.org/docs/zh-CN/setup)文档。

# 组件和JSX

GojiJS 与 React DOM 最大的差别，在于组件的不同。由于各个小程序平台并不使用标准的DOM元素（如div），而是使用小程序原生组件（如view），`@goji/core` 中以 Pascal 命名法提供了这些组件的 React 版本，开发者可以使用JSX编写代码。如下例所示：

```jsx
import React, { useState } from 'react';
import { View, Text, Button, render } from '@goji/core';
import styles from './index.css';

const App = () => {
  const [count, setCount] = useState(0);
  return (
    <View className={styles.wrapped}>
      <Text>{count}</Text>
      <Button onClick={() => setCount(count + 1)}>+</Button>
    </View>
  );
};

render(App);
```

在常见的跨平台小程序框架里——如 Taro 1/2、mpvue、uni-app，编译工具会将开发者编写的JSX代码进行静态分析，转译成小程序的 WXML 文件。由于原理上的限制，很多情况下静态分析工具并不能对代码进行完美的转译，例如当组件渲染函数中含有分支或循环，就很难转译成静态的 WXML 代码。因此在这些框架中通常只能使用 JavaScript/JSX 语法的子集，通过对开发者编码的限制满足编译器正常工作。

然而，GojiJS 并不依赖这种转译机制，它可以直接在小程序环境中运行一个 React Runtime，开发者编写的组件代码直接以 JavaScript 形式执行。由于很少依赖代码编译，GojiJS 对于语法基本没有限制，所有合法的 JavaScript 代码基本上都可以正常在小程序中运行。

GojiJS 与 React DOM、React Native 是类似的，本质上是一个 React 渲染器，通过 react-reconciler 提供的 API 兼容了标准的 React。而依赖编译手段实现的小程序框架，只是采用了类似 JSX 语法的，并不能称之为“真正的” React 框架。这也是 GojiJS 区别于其他框架最本质的区别。

例如在下面这段代码中，GojiJS 让开发者可以将组件作为变量进行赋值，根据业务编写出灵活的代码：

```jsx
const ButtonOrLink = ({ useButton }) => {
  const Comp = useButton ? Button : View;

  return <Comp>hello, world!</Comp>;
}
```

# 跨平台

除了对 React 的良好支持，GojiJS 的另一个特点是对跨平台开发非常友好，在 Airbnb 公司里工程师们基于 GojiJS 开发了包括微信、支付宝、头条在内的五个小程序平台。

使用 GojiJS 实现跨平台开发有两个好处，一是小程序平台众多，相比于 App 开发只需要兼容 iOS 和 Android 两个平台，小程序开发需要兼容的平台会更多，通过使用统一的跨平台框架，可以极大的减少重复工作量，实现一次编写各处运行；二是 React 相比于原生小程序框架API 设计也更加合理，框架本身也更加可靠，有利于业务快速迭代，即使仅开发某一个平台的小程序使用 GojiJS 也会更加高效。

虽然一些小程序平台官方或第三方提供了从微信小程序迁移的工具，但经过体验可以发现它们效果并不很理想，原因是小程序平台差异较大，很多API难以兼容。这里举一个例子，在小程序自定义组件中，监听属性变化的方式可谓是最复杂的API之一，在微信小程序中可以使用 observer 或 observers；在百度小程序中只能使用 observer；在支付宝小程序中则需要使用 deriveDataFromProps。这几种API仅通过迁移工具是很难进行兼容。

GojiJS “抛弃”了小程序自定义组件并使用了 React 作为组件化方案，因此避免了 API 差异带来的兼容性问题，开发者可以直接使用 useEffect 和它的第二个参数来监听props的变化。

```jsx
const MyComp = ({ id }) => {
  useEffect(() => {
    console.log('id changed', id);
  }, [id]);

  return <View>{id}</View>;
};
```

# 第三方库支持

由于 GojiJS 使用 npm 或 yarn 进行依赖管理，并使用基于 WebPack 的打包方案，就像开发 Web 应用一样，开发者可以安装并使用常见的第三方 NPM 包。

这里是一个使用 react-redux 的例子：

```jsx
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { myDataStringSelector } from './path/to/myDataStringSelector';

const Comp = () => {
  const dispatch = useDispatch();
  const dataString = useSelector(myDataStringSelector);
  useEffect(() => {
    dispatch({
      type: 'APP_DID_MOUNT',
    });
  }, []);

  return <View>{data}</View>;
};
```

> 当然，GojiJS 也支持HOC形式的 react-redux。

许多同时支持 React DOM 和 React Native 的包都会使用 [.native.js](https://reactnative.dev/docs/platform-specific-code#native-specific-extensions-ie-sharing-code-with-nodejs-and-web) 文件拓展名区分平台，由于小程序 JavaScript 运行环境非常类似于 React Native，GojiJS也支持了这一后缀，因此许多良好设计的包无需修改即可直接在 GojiJS 中使用。而对于一些兼容性较差的包，GojiJS 会通过 alias 的方式修复它们对 react-dom 的依赖，尽可能的兼容这些包。

经过实践，Redux、MobX、GraphQL 等常见包均可在 GojiJS 中正常使用。

# 开发效率与代码质量

GojiJS 提供了完整的类型支持，推荐开发者使用 TypeScript 作为开发语言。通过使用 Visual Studio Code 等支持 TypeScript 的代码编辑器，可以在开发者避免许多常见错误，并获得良好的代码提示体验。

在小程序中全局的 app.json 和页面的 page.json 配置文件由于格式限制，很难做到条件判断等动态内容，GojiJS提供了 `.config.ts` 格式的配置文件，它可以在编译时执行并将返回结果作为配置值，实现动态化配置，同样的，这种格式可以支持类型检查。

```jsx
// page.config.ts
// 编译为微信小程序： { "navigationBarTitleText": "这是微信小程序" }
// 编译为支付宝小程序： { "navigationBarTitleText": "这是其他alipay小程序" }
module.exports = ({ target }) => ({
  navigationBarTitleText: target === 'wechat' ? '这是微信小程序' : `这是其他${target}小程序`
});
```

GojiJS 还支持 ESLint、StyleLint、Prettier 等代码检查工具，配合[Airbnb JavaScript 样式规则](https://github.com/airbnb/javascript)使用可以保证良好的代码风格。

# 组件单元测试

提高代码质量、减少 bug 发生的一个很重要的方法，是编写高质量的可维护的单元测试。在开源社区有一些 React 组件单元测试库如 Testing Library，提高了封装良好的API接口，使开发者可以不必深入每个组件的细节即可编写出恰当的测试用例，同时满足测试覆盖率的要求。

GojiJS 中基于 Testing Library 提供了类似的库，叫做 [@goji/testing-library](https://www.npmjs.com/package/@goji/testing-library)，配合 Jest 测试框架可以对 GojiJS 组件编写单元测试用例。

以下是一个完整的测试用例：

```jsx
// component.test.tsx
import React, { useState } from 'react';
import { render, fireEvent } from '@goji/testing-library';
import { Input } from '@goji/core';

const ExampleInput = ({ onSave }: { onSave: (value: string) => void }) => {
  const [value, setValue] = useState('');

  return (
    <Input
      testID="example-input"
      value={value}
      onInput={e => setValue(e.detail.value)}
      onConfirm={() => {
        onSave(value);
        setValue('');
      }}
    />
  );
};

describe('example input', () => {
  it('works', () => {
    const onSave = jest.fn();
    const wrapper = render(<ExampleInput onSave={onSave} />);
    const input = wrapper.getByTestId('example-input');
    expect(input).toBeTruthy();

    // input
    fireEvent.input(input, 'hi');
    expect(input.props.value).toBe('hi');

    // confirm and then cleanup
    fireEvent.confirm(input);
    expect(onSave).toBeCalledTimes(1);
    expect(onSave).toBeCalledWith('hi');
    expect(input.props.value).toBe('');
  });
});
```

可以看到 GojiJS 实现了类似 React Native 中的 `testID` 属性，通过该属性可以方便的查找到组件；通过 props 可以获取组件的属性；通过 fireEvent 可以在组件上模拟点击、输入等交互事件，编写出复杂的交互测试代码。

更多使用方法可以参见官方文档的[测试库](https://goji.js.org/docs/zh-CN/testing)部分。

# 更进一步

GojiJS 的目标是让 React 与小程序完美的结合，提供简单易上手的平缓学习曲线，同时兼具强大的可拓展性和跨平台性。

官方文档是了解和学习 GojiJS 的最佳途径，它同时提供了[中文](https://goji.js.org/zh-CN/)和[英文](https://goji.js.org/)两种语言供开发者自由选择。

开源代码在 Github 仓库 [github.com/airbnb/goji-js](https://github.com/airbnb/goji-js) 中可以找到，欢迎各位开发者 star，使用过程中有任何意见或者建议可以通过issue进行反馈。

