const OriginalArray = Array;

const patchArray = () => {
  const PatchedArray = function Array<T>(this: any, value: any): Array<T> {
    let instance: Array<T>;
    if (this instanceof PatchedArray || this instanceof OriginalArray) {
      // @ts-ignore
      instance = new OriginalArray(value);
    } else {
      instance = OriginalArray(value);
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
