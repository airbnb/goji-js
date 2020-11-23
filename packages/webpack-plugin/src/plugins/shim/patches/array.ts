const OriginalArray = Array;

const patchArray = () => {
  const PatchedArray = function Array<T>(this: any): Array<T> {
    let instance: Array<T>;
    /**
     * We should avoid calling the original Array in any way, otherwise you will encounter the
     * maximum call stack size exceeded error.
     * For example, `...args` is transformed to `new Array(len)` in Babel.
     */
    if (this instanceof PatchedArray || this instanceof OriginalArray) {
      instance = OriginalArray.apply<any, Array<any>, Array<T>>(
        this,
        // eslint-disable-next-line prefer-rest-params
        OriginalArray.prototype.slice.call(arguments),
      );
    } else {
      // eslint-disable-next-line prefer-spread
      instance = OriginalArray.apply<any, Array<any>, Array<T>>(
        null,
        // eslint-disable-next-line prefer-rest-params
        OriginalArray.prototype.slice.call(arguments),
      );
    }
    Object.setPrototypeOf(instance, PatchedArray.prototype);

    return instance;
  };

  // inherit `Array.prototype`
  PatchedArray.prototype = Object.create(OriginalArray.prototype, {
    constructor: { enumerable: false, writable: true, configurable: true, value: PatchedArray },
  });

  // inherit `Array` members
  Object.setPrototypeOf(PatchedArray, OriginalArray);

  // support `instanceof Array`
  // may not work on old browsers like iOS < 9 and Android < 5
  if (typeof Symbol !== 'undefined' && Symbol.hasInstance) {
    Object.defineProperty(PatchedArray, Symbol.hasInstance, {
      enumerable: false,
      writable: true,
      configurable: true,
      value: (left: any): boolean => left instanceof OriginalArray,
    });
  }

  return PatchedArray;
};

module.exports = patchArray();
