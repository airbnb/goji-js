import React, { createRef, ReactNode } from 'react';
import { FiberRoot } from 'react-reconciler';
import { AdaptorInstance } from './adaptor';
import { merge } from './utils/merge';
import { renderIntoContainer } from './render';
import { ElementInstance, Updates } from './reconciler/instance';
import { EventProxy } from './components/eventProxy';
import { GojiProvider } from './components';
import { LifecycleName } from './lifecycles/types';
import { GOJI_VIRTUAL_ROOT, TYPE_SCOPE_UPDATER } from './constants';
import { scopedUpdaterInstance, ComponentInstance } from './reconciler/publicInstance';

let gojiBlockingMode = false;

export const setGojiBlockingMode = (value: boolean) => {
  gojiBlockingMode = value;
};

const noop = () => {};

export class Container {
  public constructor(protected adaptorInstance: AdaptorInstance) {}

  public eventProxyRef = createRef<EventProxy>();

  public fiberRootContainer?: FiberRoot;

  /**
   * `virtualRootElement` is a virtual `ElementInstance` which is used to contain root
   * dom and portal doms. This element looks like this:
   * <GOJI_VIRTUAL_ROOT>
   *   <view>the root dom</view>
   *   <view>the portal dom 1</view>
   *   <view>the portal dom 2</view>
   *   <view>the portal dom 3</view>
   *   ...
   * </GOJI_VIRTUAL_ROOT>
   * We should never render GOJI_VIRTUAL_ROOT into pages but only render its children.
   */
  public virtualRootElement = new ElementInstance(GOJI_VIRTUAL_ROOT, {}, [], this);

  private renderId = 0;

  private consumedId = -1;

  private pendingIds: number[] = [];

  private next = noop;

  private isBlocking = false;

  private mergedDiff: Record<string, any> | null = null;

  private initialRendered = false;

  // always use `string` for `renderId`
  public getRenderId() {
    return String(this.renderId);
  }

  public generateRenderId() {
    this.renderId += 1;
  }

  public requestUpdate() {
    const [data, diff] = this.virtualRootElement.pure('');
    if (process.env.NODE_ENV !== 'production') {
      // eslint-disable-next-line global-require
      const { verifyDiff } = require('./utils/diff');
      verifyDiff(this, data, diff);
    }

    let readyPendingCount = 1;

    const startTime = new Date().getTime();
    const currentRenderId = this.getRenderId();
    const currentRenderIdNum = Number(currentRenderId);
    const callback = () => {
      readyPendingCount -= 1;

      if (readyPendingCount > 0) {
        return;
      }

      if (process.env.NODE_ENV !== 'production' && Object.keys(diff).length > 0) {
        const endTime = new Date().getTime();
        console.groupCollapsed(`[goji] updated time = ${endTime - startTime}ms`);
        console.log('diff =', diff);
        console.log('data =', data);
        console.groupEnd();
      }

      let index = 0;
      for (; index < this.pendingIds.length; index += 1) {
        if (currentRenderIdNum < this.pendingIds[index]) {
          break;
        }
      }

      this.pendingIds.splice(index, 0, currentRenderIdNum);

      while (this.pendingIds.length > 0 && this.consumedId + 1 === this.pendingIds[0]) {
        const renderId = this.pendingIds.shift();
        this.emitLifecycleEvent('internalRendered', renderId);
        this.consumedId = renderId as number;
      }

      this.isBlocking = false;
      this.next();
    };

    const sendUpdateData = (payload: Updates, _callback: () => void, _currentRenderId: string) => {
      if (!this.initialRendered) {
        this.initialRendered = true;
        this.adaptorInstance.updateData(payload, _callback, _currentRenderId);

        return;
      }

      const scopedUpdates: Map<ComponentInstance, Updates> = new Map<ComponentInstance, Updates>();
      const rootUpdates: Updates = {};

      Object.keys(payload).forEach(diffPath => {
        const [scopeComponentInstance, prefix] = this.findScopeUpdateComponentInstance(diffPath);
        if (scopeComponentInstance) {
          const cachedScopedUpdate = scopedUpdates.get(scopeComponentInstance) || {};
          const isReplaceSelf = prefix === diffPath;
          const shortedPath = isReplaceSelf ? 'c' : diffPath.replace(`${prefix}.`, '');
          // @ts-ignore
          const diffPayload = isReplaceSelf ? payload[diffPath]?.c : payload[diffPath];
          Object.assign(cachedScopedUpdate, {
            [shortedPath]: diffPayload,
          });
          scopedUpdates.set(scopeComponentInstance, cachedScopedUpdate);
        } else {
          Object.assign(rootUpdates, { [diffPath]: payload[diffPath] });
        }
      });

      const scopedUpdatesInstances = Array.from(scopedUpdates.keys());

      readyPendingCount = scopedUpdatesInstances.length + 1;

      scopedUpdatesInstances.forEach(item => {
        item?.setData(scopedUpdates.get(item), _callback);
      });

      this.adaptorInstance.updateData(rootUpdates, _callback, _currentRenderId);
    };

    if (gojiBlockingMode) {
      this.next = () => {
        if (this.mergedDiff === null || Object.keys(this.mergedDiff).length === 0) {
          return;
        }

        this.isBlocking = true;
        sendUpdateData(this.mergedDiff, callback, currentRenderId);
        this.generateRenderId();
        this.next = noop;
        this.mergedDiff = null;
      };

      if (!this.isBlocking) {
        this.isBlocking = true;
        sendUpdateData(diff, callback, currentRenderId);
        this.generateRenderId();
      } else if (Object.keys(diff).length !== 0) {
        this.mergedDiff = this.mergedDiff === null ? diff : merge(this.mergedDiff, diff);
      }
    } else {
      sendUpdateData(diff, callback, currentRenderId);
      this.generateRenderId();
    }
  }

  public emitLifecycleEvent<T extends LifecycleName>(eventName: T, eventData?: any) {
    return this.eventProxyRef.current?.emitEvent(eventName, eventData);
  }

  public render(element: ReactNode | null) {
    renderIntoContainer(<GojiProvider container={this}>{element}</GojiProvider>, this);
  }

  private findScopeUpdateComponentInstance(path: string) {
    const pathArr = path.split('.');

    let instance: ComponentInstance | null = null;
    let prefix: string | null = null;

    let cursor = this.virtualRootElement;

    for (let i = 0; i < pathArr.length; i += 1) {
      const curPath = pathArr[i];
      const result = /c\[(\d+)\]/.exec(curPath);
      if (!result || !result.length || !result[1] || !cursor.children) {
        break;
      }

      const componentInstance = cursor.children?.[result[1]] as ElementInstance;

      cursor = componentInstance;

      if (componentInstance?.type === TYPE_SCOPE_UPDATER) {
        const scopeComponentInstance = scopedUpdaterInstance.get(componentInstance.id);
        if (scopeComponentInstance) {
          instance = scopeComponentInstance;
          prefix = pathArr.slice(0, i + 1).join('.');
        }
      }
    }

    return [instance, prefix];
  }
}
