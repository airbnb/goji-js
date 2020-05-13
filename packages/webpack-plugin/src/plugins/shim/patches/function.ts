// Wechat / Alipay / QQ patch the `Function` as result the `Function('')` will return `undefined` instead of `() => undefined`
// this file re-patch the `Function` to fix the issue
// Before:
// Function('return this'): () => global
// Function('any other args'): undefined // wrong
// After:
// Function('return this'): () => global
// Function('any other args'): () => undefined

const OriginalFunction = Function;

const patchFunction = () => {
  const PatchedFunction = function Function(...args: string[]) {
    let instance: Function;
    if (args.length > 0 && args[0] === 'return this') {
      // use universal global and then `global === globalThis === self === Function('return this')()`
      // eslint-disable-next-line global-require
      const theGlobal = require('../global');

      instance = function anonymous() {
        return theGlobal;
      };
    } else {
      instance = function anonymous() {
        return undefined;
      };
    }
    Object.setPrototypeOf(instance, PatchedFunction.prototype);

    return instance;
  };

  // inherit `Function.prototype`
  PatchedFunction.prototype = Object.create(OriginalFunction.prototype, {
    constructor: { enumerable: false, writable: true, configurable: true, value: PatchedFunction },
  });

  // inherit `Function` static members
  Object.setPrototypeOf(PatchedFunction, OriginalFunction);

  // support `instanceof Function`
  // especially for native ways to create Function instance, like
  //   const fn = () => {};
  //   console.log(fn instanceof PatchedFunction); // true
  // may not work on old browsers like iOS < 9 and Android < 5
  if (typeof Symbol !== 'undefined' && Symbol.hasInstance) {
    Object.defineProperty(PatchedFunction, Symbol.hasInstance, {
      enumerable: false,
      writable: true,
      configurable: true,
      value: (left: any): boolean => left instanceof OriginalFunction,
    });
  }

  return PatchedFunction;
};

module.exports = patchFunction();
