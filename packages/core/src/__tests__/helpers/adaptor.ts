import { AdaptorInstance, Adaptor } from '../../adaptor';
import { Container } from '../../container';
import { applyDiff } from '../../utils/diff';

export class TestingAdaptorInstance extends AdaptorInstance {
  public data: any = {};

  // eslint-disable-next-line
  public setData = (val: any) => {};

  private shouldManuallyResolveUpdateCallback = false;

  private updateCallbacks: Array<string> = [];

  private updateCallbackMap: { [key: string]: () => void } = {};

  // check `data` doesn't contain any non-serializable data symbol / function / etc.
  private checkUpdateDataIsPlainObject(data: any) {
    const pured = JSON.parse(JSON.stringify(data));
    expect(data).toEqual(pured);
  }

  public updateData(data: any, callback: () => void, renderId: string) {
    this.checkUpdateDataIsPlainObject(data);
    // resolve last callback when new data comes
    this.autoResolveUpdateCallback();
    this.updateCallbacks.push(renderId);
    this.updateCallbackMap[renderId] = callback;
    if (Object.keys(data).length === 0) {
      // if no data needs to be set ignore the re-rendering and run `callback` immediately
      this.autoResolveUpdateCallback();
    } else {
      this.data = applyDiff(this.data, data);
      this.setData(data);
    }
  }

  public registerEventHandling() {
    // do nothing
  }

  public unregisterEventHandler() {
    // do nothing
  }

  private autoResolveUpdateCallback() {
    if (!this.shouldManuallyResolveUpdateCallback) {
      this.resolveUpdateCallback();
    }
  }

  // manually call updateCallback for testing purpose
  public resolveUpdateCallback(renderId?: string) {
    if (!renderId) {
      if (this.updateCallbacks.length > 0) {
        const id = this.updateCallbacks.shift();
        const updateCallback = this.updateCallbackMap[id!];
        delete this.updateCallbackMap[id!];

        updateCallback();
        return true;
      }
      return false;
    }

    const updateCallback = this.updateCallbackMap[renderId];

    if (updateCallback) {
      delete this.updateCallbackMap[renderId];
      this.updateCallbacks = this.updateCallbacks.filter(val => val !== renderId);
      updateCallback();
      return true;
    }

    return false;
  }

  public setManuallyResolvedUpdateCallback(enabled: boolean) {
    this.shouldManuallyResolveUpdateCallback = enabled;
  }
}

export class TestingAdaptor extends Adaptor {
  public run(element) {
    const testingAdaptorInstance = new TestingAdaptorInstance();
    const container = new Container(testingAdaptorInstance);
    container.render(element);
    return testingAdaptorInstance;
  }
}
