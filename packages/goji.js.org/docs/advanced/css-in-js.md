---
sidebar_position: 2
---

# CSS-in-JS

CSS-in-JS is a way to organize React styling codes that allows developers to write mixture of CSS
and JS in the same file. It's usually regarded as an alternative to CSS Module.

## Why Linaria

CSS-in-JS not only provides more flexibility than CSS Module, but also brings more complex issues.

For example, [styled-components](https://github.com/styled-components/styled-components) creates a
`<style>` HTML tag in runtime, but there is no way to dynamic inject any CSS code on Mini Program.
In theory, styled-components cannot be compatible with GojiJS.

After researching we found only a few of libraries is feasible for GojiJS. The
[Linaria](https://github.com/callstack/linaria) might be the most suitable choice for these reasons.

- Linaria extract all static styles into standalone `.css` files.

- Linaria support pre/post CSS processors like PostCSS.

- Linaria can be used with CSS Module in the same project that enable developers migrate their code
  progressively.

- Linaria aims to be a zero-runtime CSS-in-JS implement which aligns the tech stack of Mini Program.

## Installation

At first, you should run

```bash
npm install linaria
```

or

```bash
yarn add linaria
```

to install Linaria in your project.

> GojiJS now support Linaria version 2

You don't have to create any config file because GojiJS CLI already done these works. So let's begin
the first demo of Linaria.

## Usages

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

The `css` tag is the most important part of Linaria that you should always wrap CSS codes inside it.

Linaria static code analyzer could extract styles into a standalone `.css` file and the `css`
sentence would be replaced with a hashed class name string. Like this,

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

The `css` tag also support nesting, pseudo-elements and pseudo-selectors. For example,

```tsx
const button = css`
  color: black;

  &:hover {
    color: blue;
  }
`;
```

becomes

```css
.button_h3m1a0 {
  color: black;
}
.button_h3m1a0:hover {
  color: blue;
}
```

### `styled`

Linaria provides a API called `styled` in `linaria/react`, which might be inspired from
_styled-components_. It's useful to create a component with some styles applied.

```tsx
const Heading = styled(View)<{ color?: string }>`
  font-size: 20rpx;
  font-weight: bold;
  color: ${props => props.color ?? 'black'};
`;
```

In above example, the `Heading` component could render different color value from its property.

> [Proposal] Don't use APIs like `styled.view` because they are designed for React DON. GojiJS might
> provides a new wrapped `styled` API from `@goji/linaria`.

For more details of `css` and `styled`, please refer to
[this link](https://github.com/callstack/linaria/blob/2.0.x/docs/BASICS.md).
