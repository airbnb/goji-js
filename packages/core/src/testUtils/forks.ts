// This file contains codes copied from React internal packages like `shared`
// https://github.com/facebook/react/tree/4fbbae8afa62b61c84cf1ca0cd7a1f5a413f59df/packages/shared

import React from 'react';
import { setImmediate } from 'timers';

// eslint-disable-next-line no-underscore-dangle
export const __DEV__ = process.env.NODE_ENV !== 'production';

export const warningWithoutStack = (
  condition: boolean | null,
  format: string,
  ...args: Array<any>
) => {
  if (!condition) {
    console.error(`Warning: ${format}`, ...args.map(item => `${item}`));
  }
};

// only support Node yet
export const enqueueTask = setImmediate;

// @ts-expect-error
export const ReactSharedInternals = React.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED; // eslint-disable-line no-underscore-dangle
