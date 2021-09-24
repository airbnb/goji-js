import {
  OnResizeOptions,
  OnScrollOptions,
  OnShareAppMessageOptions,
  OnShareAppMessageReturn,
  OnTabItemTapOptions,
} from '../lifecycles/types';
import { EventChannel } from '../utils/eventChannel';
import { useContainer } from './container';

export interface EventProxy {
  lifecycleChannel: {
    onLoad: EventChannel<Record<string, string>, void>;
    onReady: EventChannel;
    onShow: EventChannel;
    onHide: EventChannel;
    onUnload: EventChannel;
    onPullDownRefresh: EventChannel;
    onReachBottom: EventChannel;
    onPageScroll: EventChannel<OnScrollOptions, void>;
    onShareAppMessage: EventChannel<OnShareAppMessageOptions, OnShareAppMessageReturn>;
    onResize: EventChannel<OnResizeOptions, void>;
    onTabItemTap: EventChannel<OnTabItemTapOptions, void>;
    onTitleClick: EventChannel;
    onOptionMenuClick: EventChannel;
    onPopMenuClick: EventChannel;
    onPullIntercept: EventChannel;
  };
  internalChannels: {
    rendered: EventChannel<number>;
    exportedComponentUpdate: EventChannel<any>;
  };
}

export const createEventProxy = (): EventProxy => ({
  lifecycleChannel: {
    onLoad: new EventChannel<Record<string, string>, void>(),
    onReady: new EventChannel(),
    onShow: new EventChannel(),
    onHide: new EventChannel(),
    onUnload: new EventChannel(),
    onPullDownRefresh: new EventChannel(),
    onReachBottom: new EventChannel(),
    onPageScroll: new EventChannel<OnScrollOptions, void>(),
    onShareAppMessage: new EventChannel<OnShareAppMessageOptions, OnShareAppMessageReturn>(),
    onResize: new EventChannel<OnResizeOptions, void>(),
    onTabItemTap: new EventChannel<OnTabItemTapOptions, void>(),
    onTitleClick: new EventChannel(),
    onOptionMenuClick: new EventChannel(),
    onPopMenuClick: new EventChannel(),
    onPullIntercept: new EventChannel(),
  },
  internalChannels: {
    rendered: new EventChannel<number>(),
    exportedComponentUpdate: new EventChannel<any>(),
  },
});

export const useEventProxy = () => {
  const container = useContainer();

  return container.eventProxy;
};
