import React, { cloneElement, useState } from 'react';
import camelCase from 'lodash/camelCase';
import zipObject from 'lodash/zipObject';
import { Container } from '../container';
import { Adaptor, AdaptorInstance, AdaptorType, ExportComponentMeta } from './common';
import { gojiEvents } from '../events';
import { useInternalComponentUpdate } from '../lifecycles/native/hooks';
import {
  OnScrollOptions,
  OnShareAppMessageOptions,
  OnResizeOptions,
  OnTabItemTapOptions,
} from '../lifecycles/types';

export interface WeChatInstance {
  setData(data: object, callback?: Function): void;
  [key: string]: any;
  __GOJI_CONTAINER?: Container;
}

interface WeChatPageLifecycle {
  onLoad?(this: WeChatInstance, query: any): void;
  onReady?(this: WeChatInstance): void;
  onUnload?(this: WeChatInstance): void;
  onShow?(this: WeChatInstance): void;
  onHide?(this: WeChatInstance): void;
  onPullDownRefresh?(this: WeChatInstance): void;
  onReachBottom?(this: WeChatInstance): void;
  onPageScroll?(this: WeChatInstance, options: OnScrollOptions): void;
  onShareAppMessage?(this: WeChatInstance, options: OnShareAppMessageOptions): any;
  onResize?(this: WeChatInstance, options: OnResizeOptions): void;
  onTabItemTap?(this: WeChatInstance, options: OnTabItemTapOptions): void;
  onTitleClick?(this: WeChatInstance): void;
  onOptionMenuClick?(this: WeChatInstance): void;
  onPopMenuClick?(this: WeChatInstance): void;
  onPullIntercept?(this: WeChatInstance): void;
}

export interface WeChatPageConfig extends WeChatPageLifecycle {}

export interface WeChatComponentConfig {
  options?: {
    addGlobalClass?: boolean;
  };
  methods?: WeChatPageLifecycle;
  properties?: Record<string, { type: null; observer?(this: WeChatInstance, newVal: any): void }>;
  lifetimes?: {
    attached?(this: WeChatInstance): void;
    detached?(this: WeChatInstance): void;
  };
}

export class WechatAdaptorInstance extends AdaptorInstance {
  public constructor(private instance: WeChatInstance) {
    super();
  }

  public updateData(data: any, callback: () => void) {
    if (Object.keys(data).length === 0) {
      // ignore the re-rendering if no data needs to be set
      callback();
      return;
    }
    this.instance.setData(data, callback);
  }
}

const ExportComponentWrapper = ({
  instance,
  children,
  exportEvents,
}: {
  instance: WeChatInstance;
  children: JSX.Element;
  exportEvents: Array<string>;
}) => {
  const [props, setProps] = useState<object>({});
  useInternalComponentUpdate(newProps => {
    setProps({
      ...props,
      ...newProps,
    });
  });
  const eventProps = zipObject(
    exportEvents.map(event => camelCase(`on-${event}`)),
    exportEvents.map(event => (data: any) => {
      instance.triggerEvent(event, data);
    }),
  );

  return cloneElement(children, { ...props, ...eventProps });
};

export class WeChatAdaptor extends Adaptor {
  public constructor(
    private type: AdaptorType,
    private exportMeta: ExportComponentMeta = {},
    private disablePageSharing: boolean,
  ) {
    super();
  }

  public run(element: JSX.Element) {
    const pageLifecycles: WeChatPageLifecycle = {
      onLoad(this: WeChatInstance, options: any) {
        const container = new Container(new WechatAdaptorInstance(this));
        this.__GOJI_CONTAINER = container;

        container.render(element);

        this.__GOJI_CONTAINER!.eventProxy.lifecycleChannel.onLoad.emit(options);
      },

      onReady(this: WeChatInstance) {
        this.__GOJI_CONTAINER!.eventProxy.lifecycleChannel.onReady.emit();
      },

      onShow(this: WeChatInstance) {
        this.__GOJI_CONTAINER!.eventProxy.lifecycleChannel.onShow.emit();
      },

      onHide(this: WeChatInstance) {
        this.__GOJI_CONTAINER!.eventProxy.lifecycleChannel.onHide.emit();
      },

      onUnload(this: WeChatInstance) {
        this.__GOJI_CONTAINER!.eventProxy.lifecycleChannel.onUnload.emit();

        if (this.__GOJI_CONTAINER) {
          this.__GOJI_CONTAINER.render(null);
        }
        this.__GOJI_CONTAINER = undefined;
      },

      onPullDownRefresh(this: WeChatInstance) {
        this.__GOJI_CONTAINER!.eventProxy.lifecycleChannel.onPullDownRefresh.emit();
      },

      onReachBottom(this: WeChatInstance) {
        this.__GOJI_CONTAINER!.eventProxy.lifecycleChannel.onReachBottom.emit();
      },

      onPageScroll(this: WeChatInstance, options: OnScrollOptions) {
        this.__GOJI_CONTAINER!.eventProxy.lifecycleChannel.onPageScroll.emit(options);
      },

      onShareAppMessage(this: WeChatInstance, options: OnShareAppMessageOptions) {
        const results =
          this.__GOJI_CONTAINER!.eventProxy.lifecycleChannel.onShareAppMessage.emit(options);

        if (results && results.length > 1) {
          console.warn(
            `useOnShareAppMessage should be called only once in one Page, now it's called ${results.length} times`,
          );
        }

        return results[0];
      },

      onResize(this: WeChatInstance, options: OnResizeOptions) {
        this.__GOJI_CONTAINER!.eventProxy.lifecycleChannel.onResize.emit(options);
      },

      onTabItemTap(this: WeChatInstance, options: OnTabItemTapOptions) {
        this.__GOJI_CONTAINER!.eventProxy.lifecycleChannel.onTabItemTap.emit(options);
      },

      // FIXME: Alipay specific lifecycles. We should fork them to alipay adaptor later
      onTitleClick(this: WeChatInstance) {
        this.__GOJI_CONTAINER!.eventProxy.lifecycleChannel.onTitleClick.emit();
      },

      onOptionMenuClick(this: WeChatInstance) {
        this.__GOJI_CONTAINER!.eventProxy.lifecycleChannel.onOptionMenuClick.emit();
      },

      onPopMenuClick(this: WeChatInstance) {
        this.__GOJI_CONTAINER!.eventProxy.lifecycleChannel.onPopMenuClick.emit();
      },

      onPullIntercept(this: WeChatInstance) {
        this.__GOJI_CONTAINER!.eventProxy.lifecycleChannel.onPullIntercept.emit();
      },
    };

    // to disable page sharing we have to remove `onShareAppMessage` at init
    if (this.disablePageSharing) {
      delete pageLifecycles.onShareAppMessage;
    }

    const eventHandler = {
      e(evt) {
        gojiEvents.triggerEvent(evt);
      },
    };

    const { type } = this;
    if (type === 'page') {
      const pageConfig: WeChatPageConfig = pageLifecycles;
      // @ts-expect-error FIXME:
      Page({
        ...pageConfig,
        ...eventHandler,
      });
    } else if (type === 'component') {
      const componentConfig: WeChatComponentConfig = {
        methods: { ...pageLifecycles, ...eventHandler },
      };
      Component(componentConfig);
    } else if (type === 'exportComponent') {
      const { events = [], props = [] } = this.exportMeta;
      const pageConfig: WeChatComponentConfig = {
        options: {
          // if you'd like to use GojiJS as a native component, you should import the `.css` files in page or app
          addGlobalClass: true,
        },
        properties: zipObject(
          props,
          props.map(prop => ({
            // allow any type
            type: null,
            observer(this: WeChatInstance, newVal: any) {
              if (!this.__GOJI_CONTAINER) {
                return;
              }
              this.__GOJI_CONTAINER.eventProxy.internalChannels.exportedComponentUpdate.emit({
                [prop]: newVal,
              });
            },
          })),
        ),
        lifetimes: {
          attached(this: WeChatInstance) {
            const container = new Container(new WechatAdaptorInstance(this));
            this.__GOJI_CONTAINER = container;

            container.render(
              <ExportComponentWrapper instance={this} exportEvents={events}>
                {element}
              </ExportComponentWrapper>,
            );

            this.__GOJI_CONTAINER.eventProxy.internalChannels.exportedComponentUpdate.emit(
              this.properties,
            );
          },
          detached(this: WeChatInstance) {
            if (this.__GOJI_CONTAINER) {
              this.__GOJI_CONTAINER.render(null);
            }
            this.__GOJI_CONTAINER = undefined;
          },
        },
      };
      Component({
        ...pageConfig,
        pageLifetimes: {
          hide: pageLifecycles.onHide,
          show: pageLifecycles.onShow,
        },
        methods: { ...eventHandler },
      });
    }
  }
}
