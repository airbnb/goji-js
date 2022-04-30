---
sidebar_position: 4
---

# 生命周期

## 准则

不同的小程序平台提供不同的生命周期方法，因此很难写出跨平台的代码。 举个例子，React的`componentDidMount`的等价物，在微信中是`attached`，在支付宝中是`onInit`。

所以我们建议您在 Goji 中使用[通用钩子](#universal-hooks) ，即使 Goji 已将所有生命周期方法映射成的了钩子，

## 通用钩子

您可以使用所有React中可用的钩子，如 `useEffect` 或 `useLayoutEffect`。

- 检查页面或组件挂载/卸载

你可以使用 `useEffect` ，且deps为 `[]`。

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

- 检查属性变更

你可以使用 `useEffect` 且将属性作为deps。

```tsx
const MyComp = ({ id }: { id: string }) => {
  const [data, setData] = useState<ResponseData | undefined>(undefined);
  useEffect(async () => {
    // every time `id` change, fetchAPI will be called
    const data = await fetchAPI(id);
    setData(data);
  }, [id]);

  return data ? data : 'loading';
}; data : 'loading';
};
```

> 关于使用效果钩子的更多详情，请参阅 [使用效果钩子](https://reactjs.org/docs/hooks-effect.html)。

> `useEffect` 中的回调函数始终会在下次时间分片运行，一般在 `requestAnimationFrame` 中。 如果您想在组件挂载/更新后立即运行回调，请使用 `useLayoutEffect`。

- 获取加载参数

你可以使用 `useLoadOptions`：

```tsx
import { useLoadOptions } from '@goji/core';
const MyComp = () ={
  const [loadOptions, setLoadOptions] = useState<LoadOptions | undefined>();
  useLoadOptions((options: LoadOptions) ={
    setLoadOptions(options);
  });
};
```

> 我们建议使用 `useLoadOptions` 而不是 `unsafe_useOnLoad` 因为所有 `unsafe_useOnLoad` 回调只能在页面 `onLoad` 的时候运行。 如果一个组件在首次渲染后挂载， `useOnLoad` 将永远不会运行。

- 检查页面可见性

你可以使用 `useVisibility` 来检测页面是否显示。

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

## 映射的生命周期钩子

所有生命周期都在映射到以 `unsafe_use`为前缀的钩子。 例如， `onLoad` 被映射到 `unsafe_useOnLoad`, `onPullDownRefresh` 被映射到 `unsafe_useOnPullDownRefresh`。

因为Goji使用React Context 来处理生命周期事件，你可以在任何组件中使用这些钩子。 所以不需要再使用[页面生命周期](https://developers.weixin.qq.com/miniprogram/dev/framework/custom-component/lifetimes.html#%E7%BB%84%E4%BB%B6%E6%89%80%E5%9C%A8%E9%A1%B5%E9%9D%A2%E7%9A%84%E7%94%9F%E5%91%BD%E5%91%A8%E6%9C%9F)。
