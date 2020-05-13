import set from 'lodash/set';

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
      if (oldKey.startsWith(newKey)) {
        delete merged[oldKey];
        merged[newKey] = diff[newKey];
        matched = true;
      } else if (newKey.startsWith(oldKey)) {
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
