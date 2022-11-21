describe('patch `Promise`', () => {
  let PatchedPromise: typeof Promise;

  const executor = (resolve: (data: number) => void) => {
    resolve(1);
  };

  beforeAll(() => {
    process.env.GOJI_TARGET = 'wechat';
    // eslint-disable-next-line global-require
    PatchedPromise = require('../promise');
  });

  afterAll(() => {
    delete process.env.GOJI_TARGET;
  });

  test('new Promise', async () => {
    const promise = new PatchedPromise(executor);
    const data = await promise;
    expect(data).toBe(1);
  });

  test('Promise.resolve', async () => {
    const promise = PatchedPromise.resolve(2);
    const data = await promise;
    expect(data).toBe(2);
  });

  it('instanceof', () => {
    const promise = new PatchedPromise(executor);
    expect(promise).toBeInstanceOf(PatchedPromise);

    const promiseFromAsyncFunction = (async () => {})();
    expect(promiseFromAsyncFunction).toBeInstanceOf(PatchedPromise);
  });

  it('prototype', () => {
    const promise = new PatchedPromise(executor);
    expect(Object.getPrototypeOf(promise)).toBe(PatchedPromise.prototype);
  });

  // FIXME: i didn't find a way to hack this test case
  it.skip('prototype native', () => {
    const promiseFromAsyncFunction = (async () => {})();
    expect(Object.getPrototypeOf(promiseFromAsyncFunction)).toBe(PatchedPromise.prototype);
  });

  it('patch prototype method', () => {
    // @ts-expect-error
    PatchedPromise.prototype.myMethod = () => true;
    const promise = new PatchedPromise(executor);
    // @ts-expect-error
    expect(typeof promise.myMethod).toBe('function');
    // @ts-expect-error
    expect(promise.myMethod()).toBe(true);
  });

  it('constructor', () => {
    const promise = new PatchedPromise(executor);
    expect(promise.constructor).toBe(PatchedPromise);
  });

  // FIXME: we can't hack native constructor,
  // wechat js context may compare it directly to origianl constructor
  it.skip('native constructor', () => {
    const promiseFromAsyncFunction = (async () => {})();
    expect(promiseFromAsyncFunction.constructor).toBe(PatchedPromise);
  });
});
