import { gojiEvents } from './events';
import { subtreeInstances } from './reconciler/publicInstance';
import { scopedUpdaterInstances } from './reconciler/scopedUpdaterInstance';
import events from './subtreeAttachEvents';

// FIXME: a workaround to share global variable between js & ejs template
class ObjectE {
  public trigger(e: any) {
    gojiEvents.triggerEvent(e);
  }

  public subtreeAttached(id: number, instance: any) {
    subtreeInstances.set(id, instance);
    events.emit(String(id));
  }

  public subtreeDetached(id: number) {
    subtreeInstances.delete(id);
  }

  public scopedUpdaterAttach(id: number, instance: any) {
    scopedUpdaterInstances.set(id, instance);
  }

  public scopedUpdaterDetached(id: number) {
    scopedUpdaterInstances.delete(id);
  }
}

// @ts-ignore
Object.e = new ObjectE();
