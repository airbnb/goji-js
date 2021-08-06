import { CSSProperties } from 'react';

const uppercasePattern = /([A-Z])/g;
const msPattern = /^ms-/;

// from https://github.com/facebook/react/blob/b87aabdfe1b7461e7331abb3601d9e6bb27544bc/packages/react-dom/src/shared/hyphenateStyleName.js
const hyphenateStyleName = (name: string): string => name.replace(uppercasePattern, '-$1').toLowerCase().replace(msPattern, '-ms-');

// from https://github.com/facebook/react/blob/858c84206ef79f210e552c0128f01d1ae3a0cbf0/packages/react-dom/src/shared/CSSPropertyOperations.js#L90-L92
const isValueEmpty = value => value == null || typeof value === 'boolean' || value === '';

export const styleAttrStringify = (style: CSSProperties | undefined | null) => {
  if (!style) {
    return '';
  }
  const keys = Object.keys(style) as Array<keyof CSSProperties>;
  const styleParts: Array<string> = [];
  for (const key of keys) {
    const value = style[key];
    if (!isValueEmpty(value)) {
      // TODO: we can use `Number.prototype.toPrecision` for less string size
      styleParts.push(`${hyphenateStyleName(key)}:${value};`);
    }
  }
  return styleParts.join('');
};
