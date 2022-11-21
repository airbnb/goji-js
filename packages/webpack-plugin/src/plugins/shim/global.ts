const patchedGlobalVariables = require('./patches');

// eslint-disable-next-line import/no-mutable-exports
let theGlobal: any;

// some global variables are no need to be patched and we can just copy them to `global`
// this is a sub-set of JavaScript global variables
// ref: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects
// ref: `Object.getOwnPropertyNames(global)` in Node.js
const unpatchedGlobalVariables = {
  // value properties
  NaN: typeof NaN === 'undefined' ? undefined : NaN,
  Infinity: typeof Infinity === 'undefined' ? undefined : Infinity,
  undefined: typeof undefined === 'undefined' ? undefined : undefined,
  get globalThis() {
    return theGlobal;
  },

  // function properties
  // `eval` is not supported by any platform
  // `uneval` is not supported by any platform
  // eslint-disable-next-line no-restricted-globals
  isFinite: typeof isFinite === 'undefined' ? undefined : isFinite,
  // eslint-disable-next-line no-restricted-globals
  isNaN: typeof isNaN === 'undefined' ? undefined : isNaN,
  parseFloat: typeof parseFloat === 'undefined' ? undefined : parseFloat,
  parseInt: typeof parseInt === 'undefined' ? undefined : parseInt,
  decodeURI: typeof decodeURI === 'undefined' ? undefined : decodeURI,
  decodeURIComponent: typeof decodeURIComponent === 'undefined' ? undefined : decodeURIComponent,
  encodeURI: typeof encodeURI === 'undefined' ? undefined : encodeURI,
  encodeURIComponent: typeof encodeURIComponent === 'undefined' ? undefined : encodeURIComponent,
  escape: typeof escape === 'undefined' ? undefined : escape,
  unescape: typeof unescape === 'undefined' ? undefined : unescape,

  // fundamental objects
  Object: typeof Object === 'undefined' ? undefined : Object,
  Function: typeof Function === 'undefined' ? undefined : Function,
  Boolean: typeof Boolean === 'undefined' ? undefined : Boolean,
  Symbol: typeof Symbol === 'undefined' ? undefined : Symbol,

  // error objects
  Error: typeof Error === 'undefined' ? undefined : Error,
  // @ts-expect-error
  // eslint-disable-next-line no-undef
  AggregateError: typeof AggregateError === 'undefined' ? undefined : AggregateError,
  EvalError: typeof EvalError === 'undefined' ? undefined : EvalError,
  // @ts-expect-error
  // eslint-disable-next-line no-undef
  InternalError: typeof InternalError === 'undefined' ? undefined : InternalError,
  RangeError: typeof RangeError === 'undefined' ? undefined : RangeError,
  ReferenceError: typeof ReferenceError === 'undefined' ? undefined : ReferenceError,
  SyntaxError: typeof SyntaxError === 'undefined' ? undefined : SyntaxError,
  TypeError: typeof TypeError === 'undefined' ? undefined : TypeError,
  URIError: typeof URIError === 'undefined' ? undefined : URIError,

  // numbers and dates
  Number: typeof Number === 'undefined' ? undefined : Number,
  // eslint-disable-next-line no-undef
  BigInt: typeof BigInt === 'undefined' ? undefined : BigInt,
  Math: typeof Math === 'undefined' ? undefined : Math,
  Date: typeof Date === 'undefined' ? undefined : Date,

  // text processing
  String: typeof String === 'undefined' ? undefined : String,
  RegExp: typeof RegExp === 'undefined' ? undefined : RegExp,

  // indexed collections
  Array: typeof Array === 'undefined' ? undefined : Array,
  Int8Array: typeof Int8Array === 'undefined' ? undefined : Int8Array,
  Uint8Array: typeof Uint8Array === 'undefined' ? undefined : Uint8Array,
  Uint8ClampedArray: typeof Uint8ClampedArray === 'undefined' ? undefined : Uint8ClampedArray,
  Int16Array: typeof Int16Array === 'undefined' ? undefined : Int16Array,
  Uint16Array: typeof Uint16Array === 'undefined' ? undefined : Uint16Array,
  Int32Array: typeof Int32Array === 'undefined' ? undefined : Int32Array,
  Uint32Array: typeof Uint32Array === 'undefined' ? undefined : Uint32Array,
  Float32Array: typeof Float32Array === 'undefined' ? undefined : Float32Array,
  Float64Array: typeof Float64Array === 'undefined' ? undefined : Float64Array,
  // eslint-disable-next-line no-undef
  BigInt64Array: typeof BigInt64Array === 'undefined' ? undefined : BigInt64Array,
  // eslint-disable-next-line no-undef
  BigUint64Array: typeof BigUint64Array === 'undefined' ? undefined : BigUint64Array,

  // keyed collections
  Map: typeof Map === 'undefined' ? undefined : Map,
  Set: typeof Set === 'undefined' ? undefined : Set,
  WeakMap: typeof WeakMap === 'undefined' ? undefined : WeakMap,
  WeakSet: typeof WeakSet === 'undefined' ? undefined : WeakSet,

  // structured data
  ArrayBuffer: typeof ArrayBuffer === 'undefined' ? undefined : ArrayBuffer,
  // eslint-disable-next-line no-undef
  SharedArrayBuffer: typeof SharedArrayBuffer === 'undefined' ? undefined : SharedArrayBuffer,
  // eslint-disable-next-line no-undef
  Atomics: typeof Atomics === 'undefined' ? undefined : Atomics,
  DataView: typeof DataView === 'undefined' ? undefined : DataView,
  JSON: typeof JSON === 'undefined' ? undefined : JSON,

  // control abstraction objects
  Promise: typeof Promise === 'undefined' ? undefined : Promise,
  // `Generator` is not a global object, see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Generator
  // `GeneratorFunction` is not a global object, see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/GeneratorFunction
  // `AsyncFunction` is not a global object, see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/AsyncFunction

  // reflection
  Reflect: typeof Reflect === 'undefined' ? undefined : Reflect,
  Proxy: typeof Proxy === 'undefined' ? undefined : Proxy,

  // internationalization
  Intl: typeof Intl === 'undefined' ? undefined : Intl,

  // WebAssembly
  // eslint-disable-next-line no-undef
  WebAssembly: typeof WebAssembly === 'undefined' ? undefined : WebAssembly,

  // other
  // `arguments` is not a global object
  // `null` is a global variable but not in `global` object
};

// don't use `{ ...globalVariable }` otherwise `globalThis` would be undefined
Object.assign(unpatchedGlobalVariables, patchedGlobalVariables);

theGlobal = unpatchedGlobalVariables;

module.exports = theGlobal;
