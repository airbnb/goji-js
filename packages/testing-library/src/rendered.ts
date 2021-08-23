import { ReactTestInstance } from 'react-test-renderer';
import mapValues from 'lodash/mapValues';
import { byTextQueries } from './queries/text';
import type { TextMatch } from './queries/text';
import { byTestIdQueries } from './queries/testId';
import { byPropQueries } from './queries/prop';
import { prettyPrint } from './utils/prettyPrint';
import { byAnyQueries } from './queries/any';

type Apply<T, Fn extends Function> = Fn extends (t: T, ...args: infer A) => infer R
  ? (...args: A) => R
  : never;

/**
 * bind the first argument to function fn
 * fn(t, ...args) => fnWithT(...args)
 */
function apply<T, A extends Array<any>, R>(
  fn: (t: T, ...args: A) => R,
  t: T,
): Apply<T, (t: T, ...args: A) => R> {
  return (...args: A) => fn(t, ...args);
}

/**
 * bind each value in { key: fn(t, ...args) } with `t`: { key: fnWithT(...args) }
 */
function applyAll<T, Obj extends { [key: string]: (t: T, ...args: any) => any }>(
  obj: Obj,
  t: T,
): { [key in keyof Obj]: Apply<T, Obj[key]> } {
  return mapValues(obj, fn => apply(fn, t)) as any;
}

// to fix TS4023 error in `buildRenderResult`
export type { TextMatch };

export const getQueriesForElement = (container: ReactTestInstance) => ({
  ...applyAll(byTextQueries, container),
  ...applyAll(byTestIdQueries, container),
  ...applyAll(byPropQueries, container),
});

export const buildRenderResult = (container: ReactTestInstance) => {
  // this render result APIs are inspired from @testing-library/react-native
  const wrapper = {
    debug: (node?: ReactTestInstance) => console.log(prettyPrint(node ?? wrapper.baseElement)),
    get baseElement() {
      const allElements = byAnyQueries.queryAllByAny(container);
      return allElements[0] ?? null;
    },
    ...getQueriesForElement(container),
  };

  return wrapper;
};
