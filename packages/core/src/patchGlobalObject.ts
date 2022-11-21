import { gojiEvents } from './events';
import { subtreeInstances } from './reconciler/publicInstance';
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
}

// @ts-expect-error
Object.e = new ObjectE();
