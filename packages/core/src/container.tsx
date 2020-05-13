import React, { createRef, ReactNode } from 'react';
import { FiberRoot } from 'react-reconciler';
import { AdaptorInstance } from './adaptor';
import { merge } from './utils/merge';
import { renderIntoContainer } from './render';
import { ElementInstance, TextInstance } from './reconciler/instance';
import { EventProxy } from './components/eventProxy';
import { GojiProvider } from './components';
import { LifecycleName } from './lifecycles/types';

let gojiBlockingMode = false;

export const setGojiBlockingMode = (value: boolean) => {
  gojiBlockingMode = value;
};

const noop = () => {};

export class Container {
  public constructor(protected adaptorInstance: AdaptorInstance) {}

  public eventProxyRef = createRef<EventProxy>();

  public rootDOM: Array<ElementInstance | TextInstance> = [];

  public fiberRootContainer?: FiberRoot;

  private hasChildrenUpdate = false;

  private renderId = 0;

  private consumedId = -1;

  private pendingIds: number[] = [];

  private next = noop;

  private isBlocking = false;

  private mergedDiff: Record<string, any> | null = null;

  // always use `string` for `renderId`
  public getRenderId() {
    return String(this.renderId);
  }

  public generateRenderId() {
    this.renderId += 1;
  }

  public removeChild(child: ElementInstance | TextInstance) {
    const target = this.getRootDom();
    target.splice(target.indexOf(child), 1);
    child.setParent(undefined);
    this.hasChildrenUpdate = true;
  }

  public appendChild(child: ElementInstance | TextInstance) {
    const target = this.getRootDom();
    // remove existed child before insert
    // FIXME: should refactor this into ElementInstance
    const existedIndex = target.indexOf(child);
    if (existedIndex !== -1) {
      target.splice(existedIndex, 1);
    }
    target.push(child);
    child.setParent(this);
    this.hasChildrenUpdate = true;
  }

  public insertBefore(
    child: ElementInstance | TextInstance,
    beforeChild: ElementInstance | TextInstance,
  ) {
    const target = this.getRootDom();
    // remove existed child before insert
    // FIXME: should refactor this into ElementInstance
    const existedIndex = target.indexOf(child);
    if (existedIndex !== -1) {
      target.splice(existedIndex, 1);
    }
    target.splice(target.indexOf(beforeChild), 0, child);
    child.setParent(this);
    this.hasChildrenUpdate = true;
  }

  public requestUpdate() {
    const { hasChildrenUpdate } = this;
    this.hasChildrenUpdate = false;

    const rootInst = new ElementInstance('goji_root', {}, this.rootDOM, this);
    // FIXME: the auto-generated id update every time and cause `verifyDiff` failed
    rootInst.id = -1;
    rootInst.tag = undefined;

    const [data, diff] = rootInst.pure('');
    if (process.env.NODE_ENV !== 'production') {
      // eslint-disable-next-line global-require
      const { verifyDiff } = require('./utils/diff');
      verifyDiff(this, data, diff);
    }

    const startTime = new Date().getTime();
    const currentRenderId = this.getRenderId();
    const currentRenderIdNum = Number(currentRenderId);
    const newData = hasChildrenUpdate ? data : diff;
    const callback = () => {
      if (process.env.NODE_ENV !== 'production' && Object.keys(newData).length > 0) {
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

    if (gojiBlockingMode) {
      this.next = () => {
        if (this.mergedDiff === null || Object.keys(this.mergedDiff).length === 0) {
          return;
        }

        this.isBlocking = true;
        this.adaptorInstance.updateData(this.mergedDiff, callback, currentRenderId);
        this.generateRenderId();
        this.next = noop;
        this.mergedDiff = null;
      };

      if (!this.isBlocking) {
        this.isBlocking = true;
        this.adaptorInstance.updateData(newData, callback, currentRenderId);
        this.generateRenderId();
      } else if (Object.keys(newData).length !== 0) {
        this.mergedDiff = this.mergedDiff === null ? newData : merge(this.mergedDiff, newData);
      }
    } else {
      this.adaptorInstance.updateData(newData, callback, currentRenderId);
      this.generateRenderId();
    }
  }

  public registerEventHandler(handlerKey: string, handler: Function) {
    this.adaptorInstance.registerEventHandling(handlerKey, handler);
  }

  public unregisterEventHandler(handlerKey: string) {
    this.adaptorInstance.unregisterEventHandler(handlerKey);
  }

  private getRootDom() {
    return this.rootDOM;
  }

  public emitLifecycleEvent<T extends LifecycleName>(eventName: T, eventData?: any) {
    return this.eventProxyRef.current?.emitEvent(eventName, eventData);
  }

  public render(element: ReactNode | null) {
    renderIntoContainer(<GojiProvider container={this}>{element}</GojiProvider>, this);
  }
}
