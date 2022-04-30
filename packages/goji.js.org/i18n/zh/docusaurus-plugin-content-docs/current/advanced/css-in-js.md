---
sidebar_position: 2
---

# CSS-in-JS

CSS-in-JS 是一种组织 React 样式代码的方法，它允许开发者在同一个文件中混合编写 CSS 和 JS。 它通常被认为是 CSS Module 的替代品。

## 为什么是 Linaria

CSS-in-JS 不仅提供了比 CSS Module 更强大的灵活性，同时也带来了更复杂的问题。

举个例子 [styled-components](https://github.com/styled-components/styled-components) 在运行时会创建 `<style>` 标签，但在小程序里没有任何办法动态插入 CSS 代码。 理论上来讲，styled-components 是不兼容 GojiJS 的。

在研究之后，我们发现只有少数几个库对 GojiJS 来说是可行的。 [Linaria](https://github.com/callstack/linaria) 可能是最合适的选择。

- Linaria 将所有静态样式抽取为独立的 `.css` 文件。

- Linaria 支持 CSS 预、后处理器，如 PostCSS 。

- Linaria 可以在同一项目中与 CSS Module 一起使用，让开发人员可以渐进式迁移代码。

- Linaria 旨在实现零运行时间的 CSS-in-JS ，这和小程序的技术栈契合。

## 安装

首先，你需要运行

```bash
npm install linaria
```

或者

```bash
yarn add linaria
```

以在您的项目中安装 Linaria。

> GojiJS 现在支持 Linaria version 2

您不必创建任何配置文件，因为GojiJS CLI 已经完成了这些工作。 所以让我们直接开始 Linaria 的第一个例子。

## 用法

### `css`

```tsx
import { css } from 'linaria';

const title = css`
  font-size: 24px;
  font-weight: bold;
`;

const Heading = () => {
  return <View className={title}>This is a title</View>;
};
```

`css` 标签是 Linaria 中最重要的部分，你通常需要把CSS 代码写在里面。

Linaria 静态代码分析器可以将样式提取为独立的 `.css` 文件， 同时`css`语句将被哈希字符串替换。 就像这样：

```css
.title_m01a5h {
  font-size: 24px;
  font-weight: bold;
}
```

```tsx
const title = 'title_m01a5h';

const Heading = () => {
  return <View className={title}>This is a title</View>;
};
```

`css` 标签也支持嵌套、伪元素和伪选择器。 例如：

```tsx
const button = css`
  color: black;

  &:hover {
    color: blue;
  }
`;
```

变成

```css
.button_h3m1a0 {
  color: black;
}
.button_h3m1a0:hover {
  color: blue;
}
```

### `styled`

Linaria 在 `linaria/react` 中提供了一个叫 `styled`的API，它应该是参考了_styled-components_。 它可以用来创建一个带样式的组件。

```tsx
const Heading = styled(View)<{ color?: string }>`
  font-size: 20rpx;
  font-weight: bold;
  color: ${props => props.color ?? 'black'};
`; 'black'};
`;
```

在上面的例子中， `Heading` 可以根据它的属性渲染处不同的颜色。

> [Proposal] 不要使用像 `styled.view` 这样的API，因为它们是为 React DOM 设计的。 GojiJS 未来可能会提供一个`@goji/linaria`包和新的`styled` API。

关于`css` 和 `styled`详情，请参阅 [此链接](https://github.com/callstack/linaria/blob/2.0.x/docs/BASICS.md)。
