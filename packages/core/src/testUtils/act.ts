// This file is copied from `react-test-renderer/src/ReactTestRendererAct.js`
// https://github.com/facebook/react/blob/a1dbb852c29d23d5d0b76a0171eb59df4bebf684/packages/react-test-renderer/src/ReactTestRendererAct.js

import { Thenable } from 'react-reconciler';
import { reconciler } from '../reconciler';
import { ReactSharedInternals, enqueueTask, __DEV__, warningWithoutStack } from './forks';

const { batchedUpdates, flushPassiveEffects, IsThisRendererActing } = reconciler as any;

const { IsSomeRendererActing } = ReactSharedInternals;

// this implementation should be exactly the same in
// ReactTestUtilsAct.js, ReactTestRendererAct.js, createReactNoop.js

const isSchedulerMocked = false;
const flushWork = () => {
  let didFlushWork = false;
  while (flushPassiveEffects()) {
    didFlushWork = true;
  }

  return didFlushWork;
};

function flushWorkAndMicroTasks(onDone: (err?: Error) => void) {
  try {
    flushWork();
    enqueueTask(() => {
      if (flushWork()) {
        flushWorkAndMicroTasks(onDone);
      } else {
        onDone();
      }
    });
  } catch (err: any) {
    onDone(err);
  }
}

// we track the 'depth' of the act() calls with this counter,
// so we can tell if any async act() calls try to run in parallel.

let actingUpdatesScopeDepth = 0;
let didWarnAboutUsingActInProd = false;

export function act(callback: () => Thenable<unknown> | void) {
  if (!__DEV__) {
    if (didWarnAboutUsingActInProd === false) {
      didWarnAboutUsingActInProd = true;
      console.error(
        'act(...) is not supported in production builds of React, and might not behave as expected.',
      );
    }
  }
  const previousActingUpdatesScopeDepth = actingUpdatesScopeDepth;
  actingUpdatesScopeDepth += 1;

  const previousIsSomeRendererActing = IsSomeRendererActing.current;
  const previousIsThisRendererActing = IsThisRendererActing.current;
  IsSomeRendererActing.current = true;
  IsThisRendererActing.current = true;

  function onDone() {
    actingUpdatesScopeDepth -= 1;
    IsSomeRendererActing.current = previousIsSomeRendererActing;
    IsThisRendererActing.current = previousIsThisRendererActing;
    if (__DEV__) {
      if (actingUpdatesScopeDepth > previousActingUpdatesScopeDepth) {
        // if it's _less than_ previousActingUpdatesScopeDepth, then we can assume the 'other' one has warned
        warningWithoutStack(
          null,
          'You seem to have overlapping act() calls, this is not supported. ' +
            'Be sure to await previous act() calls before making a new one. ',
        );
      }
    }
  }

  let result;
  try {
    result = batchedUpdates(callback);
  } catch (error) {
    // on sync errors, we still want to 'cleanup' and decrement actingUpdatesScopeDepth
    onDone();
    throw error;
  }

  if (result !== null && typeof result === 'object' && typeof result.then === 'function') {
    // setup a boolean that gets set to true only
    // once this act() call is await-ed
    let called = false;
    if (__DEV__) {
      if (typeof Promise !== 'undefined') {
        Promise.resolve()
          .then(() => {})
          .then(() => {
            if (called === false) {
              warningWithoutStack(
                null,
                'You called act(async () => ...) without await. ' +
                  'This could lead to unexpected testing behaviour, interleaving multiple act ' +
                  'calls and mixing their scopes. You should - await act(async () => ...);',
              );
            }
          });
      }
    }

    // in the async case, the returned thenable runs the callback, flushes
    // effects and  microtasks in a loop until flushPassiveEffects() === false,
    // and cleans up
    return {
      then(resolve: () => void, reject: (err?: Error) => void) {
        called = true;
        result.then(
          () => {
            if (
              actingUpdatesScopeDepth > 1 ||
              // @ts-expect-error
              (isSchedulerMocked === true && previousIsSomeRendererActing === true)
            ) {
              onDone();
              resolve();
              return;
            }
            // we're about to exit the act() scope,
            // now's the time to flush tasks/effects
            flushWorkAndMicroTasks((err?: Error) => {
              onDone();
              if (err) {
                reject(err);
              } else {
                resolve();
              }
            });
          },
          err => {
            onDone();
            reject(err);
          },
        );
      },
    };
  }
  if (__DEV__) {
    warningWithoutStack(
      result === undefined,
      'The callback passed to act(...) function ' +
        'must return undefined, or a Promise. You returned %s',
      result,
    );
  }

  // flush effects until none remain, and cleanup
  try {
    if (
      actingUpdatesScopeDepth === 1 &&
      (isSchedulerMocked === false || previousIsSomeRendererActing === false)
    ) {
      // we're about to exit the act() scope,
      // now's the time to flush effects
      flushWork();
    }
    onDone();
  } catch (err) {
    onDone();
    throw err;
  }

  // in the sync case, the returned thenable only warns *if* await-ed
  return {
    then(resolve: () => void) {
      if (__DEV__) {
        warningWithoutStack(
          false,
          'Do not await the result of calling act(...) with sync logic, it is not a Promise.',
        );
      }
      resolve();
    },
  };
}
