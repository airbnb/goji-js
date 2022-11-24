import cloneDeep from 'lodash/cloneDeep';
import isEqual from 'lodash/isEqual';
import set from 'lodash/set';
import unset from 'lodash/unset';
import { getTemplateIds } from '../constants';
import { Container } from '../container';

const dataCache = new WeakMap<Container, object>();

export const applyDiff = (prevData: object, diff: object) => {
  const ids = getTemplateIds();
  const newData = cloneDeep(prevData);
  for (const path of Object.keys(diff)) {
    if (path.endsWith(ids.simplifiedId) && diff[path] === null) {
      unset(newData, path);
    } else {
      set(newData, path, diff[path]);
    }
  }

  return newData;
};

export const verifyDiff = (container: Container, nextData: object, diff: object) => {
  const prevData = dataCache.get(container);
  dataCache.set(container, nextData);
  if (!prevData) {
    return;
  }
  const expectedNextData = applyDiff(prevData, diff);

  if (!isEqual(expectedNextData, nextData)) {
    console.error(
      new Error('The `diff` verification failed. This might be an internal error in GojiJS.'),
    );
    console.error('GojiJS `prevData`', prevData);
    console.error('GojiJS `diff`', diff);
    console.error('GojiJS `nextData`', nextData);
    console.error('GojiJS `expectedNextData`', expectedNextData);
  }
};
