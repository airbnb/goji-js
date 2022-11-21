describe('patch `Array`', () => {
  let PatchedArray: typeof Array;

  beforeAll(() => {
    // eslint-disable-next-line global-require
    PatchedArray = require('../array');
  });

  afterAll(() => {
    delete process.env.GOJI_TARGET;
  });

  test('new Array()', () => {
    const array = new PatchedArray();
    expect(array.length).toBe(0);
    expect(Array.from(array)).toEqual([]);
  });

  test('Array()', () => {
    const array = PatchedArray();
    expect(array.length).toBe(0);
    expect(Array.from(array)).toEqual([]);
  });

  test('new Array(len)', () => {
    const array = new PatchedArray(3);
    expect(array.length).toBe(3);
    expect(Array.from(array)).toEqual([undefined, undefined, undefined]);
  });

  test('new Array(T1, T2)', () => {
    const array = new PatchedArray<number | string>(3, 'a');
    expect(array.length).toBe(2);
    expect(Array.from(array)).toEqual([3, 'a']);
  });

  it('instanceof', () => {
    const array = new PatchedArray();
    expect(array).toBeInstanceOf(PatchedArray);

    const arrayNative = [];
    expect(arrayNative).toBeInstanceOf(PatchedArray);
  });

  it('prototype', () => {
    const array = new PatchedArray();
    expect(Object.getPrototypeOf(array)).toBe(PatchedArray.prototype);
  });

  // FIXME: i didn't find a way to hack this test case
  it.skip('prototype native', () => {
    const arrayNative = () => {};
    expect(Object.getPrototypeOf(arrayNative)).toBe(PatchedArray.prototype);
  });

  it('patch prototype method', () => {
    // @ts-expect-error
    PatchedArray.prototype.myMethod = function myMethod() {
      return `${this.length} test`;
    };
    const array = new PatchedArray(3);
    // @ts-expect-error
    expect(typeof array.myMethod).toBe('function');
    // @ts-expect-error
    expect(array.myMethod()).toBe('3 test');
  });

  it('constructor', () => {
    const array = new PatchedArray();
    expect(array.constructor).toBe(PatchedArray);
  });

  // FIXME: we can't hack native constructor,
  // wechat js context may compare it directly to origianl constructor
  it.skip('native constructor', () => {
    const arrayNative = [];
    expect(arrayNative.constructor).toBe(PatchedArray);
  });
});
