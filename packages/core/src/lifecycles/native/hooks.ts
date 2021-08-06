import {
  OnScrollOptions,
  OnShareAppMessageOptions,
  OnResizeOptions,
  OnTabItemTapOptions,
  LifecycleName,
} from '../types';
import { useImmediatelyEffect } from '../../utils/effects';
import { useEventProxy } from '../../components/eventProxy';

const createLifecycleHook = <T = undefined>(name: LifecycleName) => (callback: (data: T) => void, deps?: Array<any>) => {
    const eventProxyContext = useEventProxy();
    // must use `useImmediatelyEffect` instead of `useEffect`
    useImmediatelyEffect(() => {
      if (!eventProxyContext) {
        throw new Error(
          'Cannot found `eventProxyContext`. This might be an internal error in GojiJS.',
        );
      }
      return eventProxyContext.handleEvent(name, callback as any);
    }, deps); // eslint-disable-line react-hooks/exhaustive-deps
  };

export const useOnReady = createLifecycleHook('onReady');
export const useOnUnload = createLifecycleHook('onUnload');
export const useOnPullDownRefresh = createLifecycleHook('onPullDownRefresh');
export const useOnReachBottom = createLifecycleHook('onReachBottom');
export const useOnPageScroll = createLifecycleHook<OnScrollOptions>('onPageScroll');
export const useOnShareAppMessage =
  createLifecycleHook<OnShareAppMessageOptions>('onShareAppMessage');
export const useOnResize = createLifecycleHook<OnResizeOptions>('onResize');
export const useOnTabItemTap = createLifecycleHook<OnTabItemTapOptions>('onTabItemTap');
// alipay only
export const useOnTitleClick = createLifecycleHook('onTitleClick');
export const useOnOptionMenuClick = createLifecycleHook('onOptionMenuClick');
export const useOnPopMenuClick = createLifecycleHook('onPopMenuClick');
export const useOnPullIntercept = createLifecycleHook('onPullIntercept');

// FIXME: internal hooks, consider to move to other folder
export const useInternalComponentUpdate = createLifecycleHook<object>('internalComponentUpdate');
