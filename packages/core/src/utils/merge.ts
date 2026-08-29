import set from 'lodash/set';

// `prefix` is considered an ancestor of (or equal to) `target` only if the match
// ends on a real path boundary (`.` or `[`), otherwise sibling keys that merely
// share a string prefix (e.g. `props.title` vs `props.titleColor`) would be
// mistaken for a parent/child relationship.
const isPathPrefix = (prefix: string, target: string) => {
  if (prefix === target) {
    return true;
  }
  if (!target.startsWith(prefix)) {
    return false;
  }
  const boundaryChar = target[prefix.length];
  return boundaryChar === '.' || boundaryChar === '[';
};

export const merge = (merged: Record<string, any>, diff: Record<string, any>) => {
  let before: Record<string, any> | null = null;
  if (process.env.NODE_ENV === 'development') {
    before = JSON.parse(JSON.stringify(merged));
  }

  const existingKeys = Object.keys(merged);
  const diffKeys = Object.keys(diff);
  for (const newKey of diffKeys) {
    let matched = false;
    for (const oldKey of existingKeys) {
      if (isPathPrefix(newKey, oldKey)) {
        delete merged[oldKey];
        merged[newKey] = diff[newKey];
        matched = true;
      } else if (isPathPrefix(oldKey, newKey)) {
        let val = merged[oldKey] as Record<string, any>;
        let subpath = newKey.substring(oldKey.length);
        if (subpath.startsWith('.')) {
          subpath = subpath.substring(1);
        }

        val = set(val, subpath, diff[newKey]);
        matched = true;
      }
    }

    if (!matched) {
      merged[newKey] = diff[newKey];
    }
  }

  if (process.env.NODE_ENV === 'development') {
    console.log(`[goji] before:`, before, `diff:`, diff, `merged:`, merged);
  }

  return merged;
};
