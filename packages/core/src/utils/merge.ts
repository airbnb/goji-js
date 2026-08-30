import set from 'lodash/set';

const isPathPrefix = (prefix: string, target: string) =>
  target === prefix || target.startsWith(`${prefix}.`) || target.startsWith(`${prefix}[`);

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
