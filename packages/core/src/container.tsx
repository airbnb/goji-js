import React, { ReactNode } from 'react';
import { FiberRoot } from 'react-reconciler';
import { AdaptorInstance } from './adaptor';
import { merge } from './utils/merge';
import { renderIntoContainer } from './render';
import { ElementInstance } from './reconciler/instance';
import { createEventProxy } from './components/eventProxy';
import { GojiProvider } from './components';
import { getTemplateIds, GOJI_VIRTUAL_ROOT } from './constants';

let gojiBlockingMode = false;

export const setGojiBlockingMode = (value: boolean) => {
  gojiBlockingMode = value;
};

const noop = () => {};

export class Container {
  public constructor(protected adaptorInstance: AdaptorInstance) {}

  public eventProxy = createEventProxy();

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

  // always use `string` for `renderId`
  public getRenderId() {
    return String(this.renderId);
  }

  public generateRenderId() {
    this.renderId += 1;
  }

  public requestUpdate() {
    const ids = getTemplateIds();
    const [elementNode, diff] = this.virtualRootElement.pure(ids.meta);
    const data = { [ids.meta]: elementNode };
    if (process.env.NODE_ENV !== 'production') {
      // eslint-disable-next-line global-require
      const { verifyDiff } = require('./utils/diff');
      verifyDiff(this, data, diff);
    }

    const startTime = new Date().getTime();
    const currentRenderId = this.getRenderId();
    const currentRenderIdNum = Number(currentRenderId);
    const callback = () => {
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
        const renderId = this.pendingIds.shift()!;
        this.eventProxy.internalChannels.rendered.emit(renderId);
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
        this.adaptorInstance.updateData(diff, callback, currentRenderId);
        this.generateRenderId();
      } else if (Object.keys(diff).length !== 0) {
        this.mergedDiff = this.mergedDiff === null ? diff : merge(this.mergedDiff, diff);
      }
    } else {
      this.adaptorInstance.updateData(diff, callback, currentRenderId);
      this.generateRenderId();
    }
  }

  public render(element: ReactNode | null) {
    renderIntoContainer(<GojiProvider container={this}>{element}</GojiProvider>, this);
  }
}
