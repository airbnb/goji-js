import camelCase from 'lodash/camelCase';
import { ElementInstance } from './reconciler/instance';

export class GojiEvent {
  private instanceMap = new Map<number, ElementInstance>();

  private stoppedPropagation = new Map<number, Map<string, number>>();

  public registerEventHandler(id: number, instance: ElementInstance) {
    this.instanceMap.set(id, instance);
  }

  public unregisterEventHandler(id: number) {
    this.instanceMap.delete(id);
    this.stoppedPropagation.delete(id);
  }

  public triggerEvent(e: any) {
    const { target, currentTarget, timeStamp } = e;

    const id = currentTarget.dataset.gojiId;
    const sourceId = target.dataset.gojiId;

    const type = camelCase(`on-${(e.type || '').toLowerCase()}`);
    const instance = this.instanceMap.get(id);
    if (!instance) {
      return;
    }

    let stoppedPropagation = this.stoppedPropagation.get(sourceId);
    if (stoppedPropagation && stoppedPropagation.get(type) === timeStamp) {
      return;
    }

    e.stopPropagation = () => {
      if (!stoppedPropagation) {
        stoppedPropagation = new Map<string, number>();
        this.stoppedPropagation.set(sourceId, stoppedPropagation);
      }
      stoppedPropagation.set(type, timeStamp);
    };

    instance.triggerEvent(type, e);
  }
}

export const gojiEvents = new GojiEvent();
