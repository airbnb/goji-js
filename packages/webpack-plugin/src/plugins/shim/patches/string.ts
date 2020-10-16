// core-js would override methods on String.prototype and it fails on Wechat with plugins enabled
// https://github.com/zloirock/core-js/blob/76d9bf50b1b15439366af92885c5a7a1d0ad61c6/packages/core-js/internals/fix-regexp-well-known-symbol-logic.js#L113

const OriginalString = String;

const patchString = () => {
  const PatchedString = function String(this: any, value: any): string {
    let instance: string;
    if (this instanceof PatchedString || this instanceof OriginalString) {
      // @ts-ignore
      instance = new OriginalString(value);
    } else {
      instance = OriginalString(value);
    }
    Object.setPrototypeOf(instance, PatchedString.prototype);

    return instance;
  };

  // inherit `String.prototype`
  PatchedString.prototype = Object.create(OriginalString.prototype, {
    constructor: { enumerable: false, writable: true, configurable: true, value: PatchedString },
  });

  // inherit `String` members
  Object.setPrototypeOf(PatchedString, OriginalString);

  // support `instanceof String`
  // especially for native ways to create String instance, like
  //   const string = new String('a');
  //   console.log(string instanceof PatchedString); // true
  // may not work on old browsers like iOS < 9 and Android < 5
  if (typeof Symbol !== 'undefined' && Symbol.hasInstance) {
    Object.defineProperty(PatchedString, Symbol.hasInstance, {
      enumerable: false,
      writable: true,
      configurable: true,
      value: (left: any): boolean => left instanceof OriginalString,
    });
  }

  return PatchedString;
};

module.exports = patchString();
