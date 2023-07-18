import camelCase from 'lodash/camelCase';
import { ElementInstance } from './reconciler/instance';

// Alipay doesn't support `longpress` so we have to use `longtap` in bridge templates
// and then we should change the `e.type` to make sure correct callback to be called.
// For more details see https://github.com/airbnb/goji-js/pull/48
const processingEventBeforeDispatch = (e: any) => {
  if (process.env.GOJI_TARGET === 'alipay' && e.type === 'longTap') {
    e.type = 'longPress';
  }
};

export class GojiEvent {
  private instanceMap = new Map<number, ElementInstance>();

  public registerEventHandler(id: number, instance: ElementInstance) {
    this.instanceMap.set(id, instance);
  }

  public unregisterEventHandler(id: number) {
    this.instanceMap.delete(id);
  }

  public triggerEvent(e: any) {
    processingEventBeforeDispatch(e);
    const { currentTarget, timeStamp, timestamp } = e;

    // some events, like 'input' of `textarea`, use `timestamp` instead of `timeStamp`
    // https://github.com/airbnb/goji-js/issues/208
    const fixedTimeStamp = timeStamp ?? timestamp ?? undefined;

    const id = currentTarget.dataset.gojiId;
    const type = camelCase(`on-${(e.type || '').toLowerCase()}`);

    const instance = this.instanceMap.get(id);
    if (!instance) {
      return;
    }

    e.stopPropagation = () => {
      instance.stopPropagation(type, fixedTimeStamp);
    };

    instance.triggerEvent(type, fixedTimeStamp, e);
  }
}

export const gojiEvents = new GojiEvent();
