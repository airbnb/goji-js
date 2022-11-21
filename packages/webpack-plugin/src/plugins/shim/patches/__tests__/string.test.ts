describe('patch `String`', () => {
  let PatchedString: typeof String;

  const value = 'hello, world!';

  beforeAll(() => {
    // eslint-disable-next-line global-require
    PatchedString = require('../string');
  });

  afterAll(() => {
    delete process.env.GOJI_TARGET;
  });

  test('new String()', () => {
    const string = new PatchedString(value);
    expect(string.toString()).toBe(value);
    expect(string.valueOf()).toBe(value);
  });

  test('String()', () => {
    const string = PatchedString(value);
    expect(string).toBe(value);
    expect(string.toString()).toBe(value);
    expect(string.valueOf()).toBe(value);
  });

  it('instanceof', () => {
    const string = new PatchedString(value);
    expect(string).toBeInstanceOf(PatchedString);

    const stringPrimitive = value;
    // primitive string is not instanceof `String` although their prototypes are same
    expect(stringPrimitive).not.toBeInstanceOf(PatchedString);
  });

  it('prototype', () => {
    const string = new PatchedString(value);
    expect(Object.getPrototypeOf(string)).toBe(PatchedString.prototype);
  });

  // FIXME: i didn't find a way to hack this test case
  it.skip('prototype native', () => {
    const stringPrimitive = value;
    // primitive string is not instanceof `String` although their prototypes are same
    expect(Object.getPrototypeOf(stringPrimitive)).toBe(PatchedString.prototype);
  });

  it('patch prototype method', () => {
    // @ts-expect-error
    PatchedString.prototype.myMethod = function myMethod() {
      return `${this} test`;
    };
    const string = new PatchedString(value);
    // @ts-expect-error
    expect(typeof string.myMethod).toBe('function');
    // @ts-expect-error
    expect(string.myMethod()).toBe('hello, world! test');
  });

  it('constructor', () => {
    const string = new PatchedString(value);
    expect(string.constructor).toBe(PatchedString);
  });

  // FIXME: we can't hack native constructor,
  // wechat js context may compare it directly to origianl constructor
  it.skip('native constructor', () => {
    const stringPrimitive = value;
    expect(stringPrimitive.constructor).toBe(PatchedString);
  });
});
