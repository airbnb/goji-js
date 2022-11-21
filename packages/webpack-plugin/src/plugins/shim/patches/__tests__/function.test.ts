describe('patch `Function`', () => {
  const OriginalFunction = global.Function;
  let PatchedFunction: typeof Function;

  beforeAll(() => {
    function mockFunction(source: string) {
      if (source === 'return this') {
        return function anonymous() {
          return global;
        };
      }

      return undefined;
    }
    mockFunction.prototype = OriginalFunction.prototype;
    global.Function = mockFunction as any;

    process.env.GOJI_TARGET = 'wechat';
    // eslint-disable-next-line global-require
    PatchedFunction = require('../function');
  });

  afterAll(() => {
    global.Function = OriginalFunction;
    delete process.env.GOJI_TARGET;
  });

  it('blocked function', () => {
    // eslint-disable-next-line no-new-func
    const fn = Function('global.__shouldNotBeSet = true');
    // test mock works
    expect(fn).toBeUndefined();

    const fnPatched = PatchedFunction('global.__shouldNotBeSet = true');
    expect(fnPatched).toBeTruthy();
    fnPatched();
    // eslint-disable-next-line no-underscore-dangle
    expect(global.__shouldNotBeSet).not.toBe(true);
  });

  it('return this', () => {
    // eslint-disable-next-line no-new-func
    const fn = Function('return this');
    expect(fn).toBeInstanceOf(OriginalFunction);
    expect(fn()).toBe(global);

    // eslint-disable-next-line no-new-func
    const fnPatched = PatchedFunction('return this');
    expect(fnPatched).toBeInstanceOf(OriginalFunction);
    // eslint-disable-next-line global-require
    expect(fnPatched()).toBe(require('../../global'));
  });

  it('instanceof', () => {
    const fn = PatchedFunction('return this');
    expect(fn).toBeInstanceOf(PatchedFunction);

    const fnNative = () => {};
    expect(fnNative).toBeInstanceOf(PatchedFunction);
  });

  it('prototype', () => {
    const fn = PatchedFunction('return this');
    expect(Object.getPrototypeOf(fn)).toBe(PatchedFunction.prototype);
  });

  // FIXME: i didn't find a way to hack this test case
  it.skip('prototype native', () => {
    const fnNative = () => {};
    expect(Object.getPrototypeOf(fnNative)).toBe(PatchedFunction.prototype);
  });

  it('patch prototype method', () => {
    // @ts-expect-error
    PatchedFunction.prototype.myMethod = () => true;
    const promise = new PatchedFunction('return this');
    // @ts-expect-error
    expect(typeof promise.myMethod).toBe('function');
    // @ts-expect-error
    expect(promise.myMethod()).toBe(true);
  });

  it('constructor', () => {
    const fn = PatchedFunction('return this');
    expect(fn.constructor).toBe(PatchedFunction);
  });

  // FIXME: we can't hack native constructor,
  // wechat js context may compare it directly to origianl constructor
  it.skip('native constructor', () => {
    const fnNative = () => {};
    expect(fnNative.constructor).toBe(PatchedFunction);
  });

  // if there is a `function f() {}`
  // `Object.prototype.toString.call(f)` is `[object Function]`
  // `Function.prototype.toString.call(f)` is `function f() {}`
  // some 3rd party libraries requires this check
  // ref: lodash https://github.com/lodash/lodash/blob/3390d9309b1025ccc253e01c5dcbf4f186c5b15f/.internal/getTag.js#L34
  it('toString', () => {
    function fn() {
      return true;
    }
    expect(fn.toString()).toMatch(/^function fn\(\) {/);
    expect(PatchedFunction.prototype.toString.call(fn)).toMatch(/^function fn\(\) {/);
    expect(Object.prototype.toString.call(fn)).toBe('[object Function]');
  });
});
