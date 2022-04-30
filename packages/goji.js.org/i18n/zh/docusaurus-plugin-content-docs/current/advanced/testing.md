---
sidebar_position: 4
---

# 测试

## 目的

你想要编写可维护的单元测试，以增强您对组件正常工作的信心。 有许多为React和类React框架设计的开源测试库。 其中最受欢迎的是 [testing library](https://testing-library.com/) ，它 提供友好和通用的 API 来写入可拓展的测试用例。

我们为 [testing library](https://testing-library.com/) 提供了绑定，叫做 [@goji/testing-library](https://www.npmjs.com/package/@goji/testing-library)，它可以与Jest等测试运行器一起使用。

## 安装

对于 npm 用户，

```bash
npm install @goji/testing-library --save-dev
```

对于 yarn 用户，

```bash
yarn add @goji/testing-library --dev
```

阅读 [Jest 文档](https://jestjs.io/) 来编写一个 Jest配置文件。 你可以复制[这里](https://github.com/airbnb/goji-js/tree/master/packages/demo-todomvc) 的三个文件 `jest.config.js`, `jestFileMocks` 和 `jestBabelTransform.js` 到你的项目。

## 示例

```tsx
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

## API

### `render`

`render` 将使用[React 测试渲染器](https://reactjs.org/docs/test-renderer.html)在NodeJS 中运行组件。 像在真实的小程序里一样，它可以挂载组件并运行组件的生命周期，。

它返回一个wrapper，这样你可以通过不同的查询找到并访问特定的子节点。 在示例情况下 `getByTestId` 返回匹配 `testID` 属性的第一个节点。

### `render` 选项

#### 查询

GojiJS 提供了几种类型的查询，所有查询都是由variants和 `By-` 查询组合的。 它们遵循testing library的最佳实践。 你可以在[这里](https://testing-library.com/docs/dom-testing-library/api-queries)找到更多信息。

Variants

- getBy
- getAllBy
- queryBy
- queryAllBy
- findBy
- findAllBy

`By-` 查询：

- `ByTestId(testId: string)` : 匹配 `testID` 属性
- `ByText(text: string | RegExp | ((text: string, node: ReactTestInstance) => boolean))` : 匹配元素内的文本，更多细节见 [TextMatch](https://testing-library.com/docs/queries/about/#textmatch)
- `ByProp(propKey: string, propValue: string)` : 匹配特定属性

我们建议使用 `testID` ，因为它不会造成运行时损耗。

> 如果你希望添加新的查询，欢迎[创建一个issue](https://github.com/airbnb/goji-js/issues)

#### `debug`

此方法在控制台中打印元素以便调试.

```tsx
const wrapper = render(<Comp />);
// print all elements
wrapper.debug();
// print specific elements
wrapper.debug(wrapper.getByTextId('test'));
```

![调试示例](https://user-images.githubusercontent.com/1812118/89996259-28396080-dcbd-11ea-9e4d-f031c65b835f.png)

### `within`

如果你想在特定的节点中查询，可以使用 `within`。

```tsx
const Comp = () => (
  <View testID="view">
    <Button>Click me</Button>
  </View>
);
const wrapper = render(<Comp />);
const view = wrapper.getByTestId('view');
const buttonInsideView = within(view).getByText('Click me');
```

### `fireEvent`

在测试用例中，如果你想模拟节点上的交互事件，可以使用`fireEvent.[event]` 。

例如，要将文本输入到 `<Input testID="my-test-id">` 元素中，你可以使用：

```tsx
const input = wrapper.getByTestId('my-test-id');
fireEvent.input(input, 'hello, world!');
```

` fireEvent ` 支持这些事件。

- tap
- input
- confirm

> 如果你想要添加新的事件，欢迎 [创建一个issue](https://github.com/airbnb/goji-js/issues)。

### `act`

`act` 函数和 [React测试渲染器](https://reactjs.org/docs/test-renderer.html#testrendereract) 中的类似。 通常你应该在 `act` 中包裹组件的异步更新。

```tsx
let increase: Function;
const Comp = () => {
  const [count, setCount] = useState(0);
  increase = () => setCount(count + 1);

  return <View>Count: {count}</View>;
};
const wrapper = render(<Comp />);
act(() => {
  // update component
  increase();
});
expect(wrapper.getByText('Count: 1')).toBeTruthy;
```

请注意，所有 `fireEvent ` 方法已经被 `act`包裹了 ，因此没有必要再次调用。

### `waitFor` 和 `waitForElement`

`waitFor` 会捕获断言错误直到通过，否则会在超时后抛出异常。 它用于组件的异步测试。

这里是一个示例：

```tsx
await waitFor(() => expect(wrapper.getByText('hello')).toBeTruthy());
```

它等价于：

```tsx
await waitForElement(() => wrapper.getByText('hello'));
```
