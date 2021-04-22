// when enabling plugin in WeChat some global variables are frozen
// for example `core-js` uses `Promise.prototype.then = ...` and it's blocked with non-writable error
// this patch aims to unfreeze the `Promise.prototype`

const OriginalPromise = Promise;

const patchPromise = () => {
  const PatchedPromise = function Promise<T>(
    this: any,
    executor: (
      resolve: (value: T | PromiseLike<T>) => void,
      reject: (reason?: any) => void,
    ) => void,
  ): Promise<T> {
    if (!(this instanceof PatchedPromise || this instanceof OriginalPromise)) {
      throw new TypeError('Cannot call a class as a function');
    }

    const instance = new OriginalPromise(executor);
    Object.setPrototypeOf(instance, PatchedPromise.prototype);

    return instance;
  };

  // inherit `Promise.prototype`
  PatchedPromise.prototype = Object.create(OriginalPromise.prototype, {
    constructor: { enumerable: false, writable: true, configurable: true, value: PatchedPromise },
  });

  // inherit `Promise` members
  Object.setPrototypeOf(PatchedPromise, OriginalPromise);

  // support `instanceof Promise`
  // especially for native ways to create Promise instance, like
  //   const promise = (async () => {})();
  //   console.log(promise instanceof PatchedPromise); // true
  // may not work on old browsers like iOS < 9 and Android < 5
  if (typeof Symbol !== 'undefined' && Symbol.hasInstance) {
    Object.defineProperty(PatchedPromise, Symbol.hasInstance, {
      enumerable: false,
      writable: true,
      configurable: true,
      value: (left: any): boolean => left instanceof OriginalPromise,
    });
  }

  return PatchedPromise;
};

module.exports = patchPromise();
