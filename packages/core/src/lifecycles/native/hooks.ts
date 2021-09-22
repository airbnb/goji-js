import {
  OnScrollOptions,
  OnShareAppMessageOptions,
  OnResizeOptions,
  OnTabItemTapOptions,
} from '../types';
import { useImmediatelyEffect } from '../../utils/effects';
import { EventProxy, useEventProxy } from '../../components/eventProxy';
import { EventChannel } from '../../utils/eventChannel';

const createLifecycleHook =
  <T = undefined>(channelSelector: (eventProxy: EventProxy) => EventChannel<any, any>) =>
  (callback: (data: T) => void, deps?: Array<any>) => {
    const eventProxyContext = useEventProxy();
    // must use `useImmediatelyEffect` instead of `useEffect`
    useImmediatelyEffect(() => {
      if (!eventProxyContext) {
        throw new Error(
          'Cannot found `eventProxyContext`. This might be an internal error in GojiJS.',
        );
      }
      return channelSelector(eventProxyContext).on(callback as any);
    }, deps); // eslint-disable-line react-hooks/exhaustive-deps
  };

export const useOnReady = createLifecycleHook(_ => _.lifecycleChannel.onReady);
export const useOnUnload = createLifecycleHook(_ => _.lifecycleChannel.onUnload);
export const useOnPullDownRefresh = createLifecycleHook(_ => _.lifecycleChannel.onPullDownRefresh);
export const useOnReachBottom = createLifecycleHook(_ => _.lifecycleChannel.onReachBottom);
export const useOnPageScroll = createLifecycleHook<OnScrollOptions>(
  _ => _.lifecycleChannel.onPageScroll,
);
export const useOnShareAppMessage = createLifecycleHook<OnShareAppMessageOptions>(
  _ => _.lifecycleChannel.onShareAppMessage,
);
export const useOnResize = createLifecycleHook<OnResizeOptions>(_ => _.lifecycleChannel.onResize);
export const useOnTabItemTap = createLifecycleHook<OnTabItemTapOptions>(
  _ => _.lifecycleChannel.onTabItemTap,
);
// alipay only
export const useOnTitleClick = createLifecycleHook(_ => _.lifecycleChannel.onTitleClick);
export const useOnOptionMenuClick = createLifecycleHook(_ => _.lifecycleChannel.onOptionMenuClick);
export const useOnPopMenuClick = createLifecycleHook(_ => _.lifecycleChannel.onPopMenuClick);
export const useOnPullIntercept = createLifecycleHook(_ => _.lifecycleChannel.onPullIntercept);

// FIXME: internal hooks, consider to move to other folder
export const useInternalComponentUpdate = createLifecycleHook<object>(
  _ => _.internalChannels.exportedComponentUpdate,
);
