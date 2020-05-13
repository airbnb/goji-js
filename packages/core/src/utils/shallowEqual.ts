const { is, keys } = Object;
const { isArray } = Array;

export const shallowEqual = (objA: any, objB: any): boolean => {
  if (is(objA, objB)) return true;
  if (typeof objA !== 'object' || objA === null || typeof objB !== 'object' || objB === null) {
    return false;
  }
  const keysA = keys(objA);
  const keysB = keys(objB);
  return (
    isArray(objA) === isArray(objB) &&
    keysA.length === keysB.length &&
    keysA.find(index => !is(objA[index], objB[index])) === undefined
  );
};
