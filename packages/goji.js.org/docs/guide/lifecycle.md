---
sidebar_position: 4
---

# Lifecycle

## Guidelines

Different Mini Program platform provides different lifecycle methods and it made it hard to write
cross-platform codes. For example, the equivalent of React `componentDidMount` is `attached` in
WeChat while `onInit` in Alipay.

So we advise you to use [universal hooks](#universal-hooks) in Goji even if Goji mapped all
lifecycle methods into their hooks,

## Universal hooks

You can use all available hooks from React like `useEffect` or `useLayoutEffect`.

- Check page or component mounted / unmounted

You can use `useEffect` with empty deps `[]`.

```tsx
const MyComp = () => {
  useEffect(() => {
    console.log('component mounted');
    return () => {
      console.log('component unmounted');
    };
  }, []);

  return null;
};
```

- Check props changed

You can use `useEffect` with props as deps.

```tsx
const MyComp = ({ id }: { id: string }) => {
  const [data, setData] = useState<ResponseData | undefined>(undefined);
  useEffect(async () => {
    // every time `id` change, fetchAPI will be called
    const data = await fetchAPI(id);
    setData(data);
  }, [id]);

  return data ? data : 'loading';
};
```

> For more detail about how to use effect hooks please see
> [Using the Effect Hook](https://reactjs.org/docs/hooks-effect.html).

> The callback function in `useEffect` would always run in the next scheduled time slice, usually in
> the `requestAnimationFrame`. If you'd like to run callback immediately after component
> mounted/updated please use `useLayoutEffect`.

- Get load options

You can use `useLoadOptions`:

```tsx
import { useLoadOptions } from '@goji/core';
const MyComp = () ={
  const [loadOptions, setLoadOptions] = useState<LoadOptions | undefined>();
  useLoadOptions((options: LoadOptions) ={
    setLoadOptions(options);
  });
};
```

> We advice to use `useLoadOptions` instead of `unsafe_useOnLoad` because all `unsafe_useOnLoad`
> callback only runs once when the page's `onLoad` run. If a component mounted after the firs time
> rendering the `unsafe_useOnLoad` would never run.

- Check page visibility

You can use `useVisibility` to detect whether the page is shown.

```tsx
import { useVisibility } from '@goji/core';
const MyComp = () ={
  useVisibility((shown: boolean) ={
    if (shown) {
      // onShow codes here
    } else {
      // onHide codes here
    }
  });
};
```

## Mapped lifecycle hooks

All lifecycles are mapping to hooks prefixed with `unsafe_use`. For example, `onLoad` is mapped to
`unsafe_useOnLoad`, `onPullDownRefresh` is mapped to `unsafe_useOnPullDownRefresh`

Since Goji use React Context for lifecycle events passing you can use these hooks in any component.
So there is no need to use
[pageLifetimes](https://developers.weixin.qq.com/miniprogram/dev/framework/custom-component/lifetimes.html#%E7%BB%84%E4%BB%B6%E6%89%80%E5%9C%A8%E9%A1%B5%E9%9D%A2%E7%9A%84%E7%94%9F%E5%91%BD%E5%91%A8%E6%9C%9F)
any more.
