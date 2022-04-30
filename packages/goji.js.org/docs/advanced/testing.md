---
sidebar_position: 4
---

# Testing Library

## Purpose

You want to write maintainable tests that give you high confidence that your components are working
for your users. There are many open-source testing libraries designed for React and React-like
frameworks. The most popular one of them is the [testing library](https://testing-library.com/) that
provides friendly and universal APIs to write scalable test cases.

We provides a binding for the [testing library](https://testing-library.com/) called
[@goji/testing-library](https://www.npmjs.com/package/@goji/testing-library), which should work well
with Jest and others test runners.

## Installation

For npm users,

```bash
npm install @goji/testing-library --save-dev
```

For yarn users,

```bash
yarn add @goji/testing-library --dev
```

Read the [Jest documentation](https://jestjs.io/) to setup a Jest config file. You can copy these
three files, `jest.config.js`, `jestFileMock.js` and `jestBabelTransform.js` from
[here](https://github.com/airbnb/goji-js/tree/master/packages/demo-todomvc) to your project.

## Example

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

`render` will run the components in NodeJS by
[React Test Renderer](https://reactjs.org/docs/test-renderer.html). It mount the components and run
their lifecycles as the same way as real Mini Programs.

It returns a wrapper so you can find and enter the specific children element by different queries.
In this case `getByTestId` returns the first element which matches the `testID` property.

### `render` Options

#### Queries

GojiJS provides several types of queries, all of them are combined from variants and `By-` queries.
They follow the best practices from the testing library. You can find more information
[here](https://testing-library.com/docs/dom-testing-library/api-queries).

Variants:

- getBy
- getAllBy
- queryBy
- queryAllBy
- findBy
- findAllBy

`By-` queries:

- `ByTestId(testId: string)` : matches the `testID` property
- `ByText(text: string | RegExp | ((text: string, node: ReactTestInstance) => boolean))` : matches
  element's inner text, for more details see
  [TextMatch](https://testing-library.com/docs/queries/about/#textmatch)
- `ByProp(propKey: string, propValue: string)` : matches specific property

We recommend to use `testID` because it doesn't affect any runtime cost.

> Feel free to [create an issue](https://github.com/airbnb/goji-js/issues) if you'd like to append
> new queries.

#### `debug`

This methods print the elements in console for debug purpose.

```tsx
const wrapper = render(<Comp />);
// print all elements
wrapper.debug();
// print specific elements
wrapper.debug(wrapper.getByTextId('test'));
```

![demo of debug](https://user-images.githubusercontent.com/1812118/89996259-28396080-dcbd-11ea-9e4d-f031c65b835f.png)

### `within`

If you'd like to restrict your query in specific container, you can use `within`.

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

In your test cases, if you'd like to simulates the interactive events on the elements the
`fireEvent.[event]` could help.

For example, to input text into the `<Input testID="my-test-id">` element, you can use,

```tsx
const input = wrapper.getByTestId('my-test-id');
fireEvent.input(input, 'hello, world!');
```

`fireEvent` supports these events,

- tap
- input
- confirm

> Feel free to [create an issue](https://github.com/airbnb/goji-js/issues) if you'd like to use new
> events.

### `act`

The `act` function has same behavior in
[React Test Renderer](https://reactjs.org/docs/test-renderer.html#testrendereract). Usually you
should wrap the async component updating in `act`.

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

Please note that all `fireEvent` methods are already wrapped by `act` so there is no need to wrap
again.

### `waitFor` and `waitForElement`

`waitFor` catches the assertion error util it passed, otherwise throw after timeout. It's used for
async component tests.

Here is an example,

```tsx
await waitFor(() => expect(wrapper.getByText('hello')).toBeTruthy());
```

It equals to,

```tsx
await waitForElement(() => wrapper.getByText('hello'));
```
