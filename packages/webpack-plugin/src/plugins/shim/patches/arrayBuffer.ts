const OriginalArrayBuffer = ArrayBuffer;

const patchArrayBuffer = () => {
  const PatchedArrayBuffer = function ArrayBuffer(this: any, byteLength: number): ArrayBuffer {
    if (!(this instanceof PatchedArrayBuffer || this instanceof OriginalArrayBuffer)) {
      throw new TypeError('Cannot call a class as a function');
    }
    const instance = new OriginalArrayBuffer(byteLength);
    Object.setPrototypeOf(instance, PatchedArrayBuffer.prototype);

    return instance;
  };

  // inherit `ArrayBuffer.prototype`
  PatchedArrayBuffer.prototype = Object.create(OriginalArrayBuffer.prototype, {
    constructor: {
      enumerable: false,
      writable: true,
      configurable: true,
      value: PatchedArrayBuffer,
    },
  });

  // inherit `ArrayBuffer` members
  Object.setPrototypeOf(PatchedArrayBuffer, OriginalArrayBuffer);

  // support `instanceof ArrayBuffer`
  // may not work on old browsers like iOS < 9 and Android < 5
  if (typeof Symbol !== 'undefined' && Symbol.hasInstance) {
    Object.defineProperty(PatchedArrayBuffer, Symbol.hasInstance, {
      enumerable: false,
      writable: true,
      configurable: true,
      value: (left: any): boolean => left instanceof OriginalArrayBuffer,
    });
  }

  return PatchedArrayBuffer;
};

module.exports = patchArrayBuffer();
