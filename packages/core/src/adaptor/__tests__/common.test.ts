import { AdaptorInstance } from '../common';

interface MockInstance {
  log: Array<any>;
}

describe('AdaptorInstance', () => {
  test('works for mock adaptor config', () => {
    const mockInstance: MockInstance = { log: [] };
    class MockAdaptorInstance extends AdaptorInstance {
      public constructor(private instance: MockInstance) {
        super();
      }

      public updateData(data, callback) {
        this.instance.log = ['updateData', data, callback];
      }

      public registerEventHandling(handlerKey, handler) {
        this.instance.log = ['registerEventHandling', handlerKey, handler];
      }

      public unregisterEventHandler(handlerKey) {
        this.instance.log = ['unregisterEventHandler', handlerKey];
      }
    }
    const adaptor = new MockAdaptorInstance(mockInstance);

    const data = {};
    const setDataCallback = () => {};
    adaptor.updateData(data, setDataCallback);
    expect(mockInstance.log).toStrictEqual(['updateData', data, setDataCallback]);

    const onClick = () => {};
    adaptor.registerEventHandling('onClick', onClick);
    expect(mockInstance.log).toStrictEqual(['registerEventHandling', 'onClick', onClick]);

    adaptor.unregisterEventHandler('onClick');
    expect(mockInstance.log).toStrictEqual(['unregisterEventHandler', 'onClick']);
  });
});
