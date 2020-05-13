// the `meta.ts` is used for compiling and the `patches/index.ts` is used for runtime

export const patchedVariables = ['Function', 'Promise', 'String', 'getCurrentPages'];

export const undefinedVariables = [
  'window',
  'MessageChannel',
  'MutationObserver',
  'WebKitMutationObserver',
];
