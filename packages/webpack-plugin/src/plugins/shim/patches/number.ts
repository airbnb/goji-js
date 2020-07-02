const OriginalNumber = Number;

const patchNumber = () => {
  const PatchedNumber = function Number(this: any, value: any): Number {
    let instance: Number;
    if (this instanceof PatchedNumber || this instanceof OriginalNumber) {
      instance = new OriginalNumber(value);
    } else {
      instance = OriginalNumber(value);
    }
    Object.setPrototypeOf(instance, PatchedNumber.prototype);

    return instance;
  };

  // inherit `Number.prototype`
  PatchedNumber.prototype = Object.create(OriginalNumber.prototype, {
    constructor: {
      enumerable: false,
      writable: true,
      configurable: true,
      value: PatchedNumber,
    },
  });

  // inherit `Number` members
  Object.setPrototypeOf(PatchedNumber, OriginalNumber);

  // support `instanceof Number`
  // may not work on old browsers like iOS < 9 and Android < 5
  if (typeof Symbol !== 'undefined' && Symbol.hasInstance) {
    Object.defineProperty(PatchedNumber, Symbol.hasInstance, {
      enumerable: false,
      writable: true,
      configurable: true,
      value: (left: any): boolean => left instanceof OriginalNumber,
    });
  }

  return PatchedNumber;
};

module.exports = patchNumber();
