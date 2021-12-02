import posthtml from 'posthtml';
import { replaceExtPosix } from '../../path';

export const removeDirectiveBrackets = (): posthtml.Plugin<never> => tree => {
  const removeBrackets = (value: string) => {
    const trimed = value.trim();
    if (/^{{.*}}$/.test(trimed)) {
      return trimed.slice(2, -2);
    }
    return value;
  };

  tree.walk(node => {
    if (node.attrs) {
      for (const [name, value] of Object.entries(node.attrs)) {
        if (name.startsWith('wx:') && value) {
          node.attrs[name] = removeBrackets(value);
        }
      }
    }
    return node;
  });
};

export const transformConditionDirective = (): posthtml.Plugin<never> => tree => {
  tree.walk(node => {
    if (node.attrs) {
      for (const [name, value] of Object.entries(node.attrs)) {
        if (['wx:if', 'wx:else', 'wx:elif'].includes(name)) {
          const newName = name.replace(/^wx:/, 's-');
          delete node.attrs[name];
          node.attrs[newName] = value;
        }
      }
    }
    return node;
  });
};

export const transformLoopDirective = (): posthtml.Plugin<never> => tree => {
  tree.walk(node => {
    if (node.attrs && 'wx:for' in node.attrs) {
      const { attrs } = node;
      const wxFor = attrs['wx:for']; // arr
      const wxKey = attrs['wx:key']; // id
      const wxForItem = attrs['wx:for-item'] ?? 'item';
      const wxForIndex = attrs['wx:for-index'] ?? 'index';

      if (!wxKey) {
        attrs['s-for'] = `${wxForItem}, ${wxForIndex} in ${wxFor}`;
      } else if (wxKey === '*this') {
        attrs['s-for'] = `${wxForItem}, ${wxForIndex} in ${wxFor} trackBy ${wxForItem}`;
      } else {
        attrs['s-for'] = `${wxForItem}, ${wxForIndex} in ${wxFor} trackBy ${wxForItem}.${wxKey}`;
      }

      delete attrs['wx:for'];
      delete attrs['wx:key'];
      delete attrs['wx:for-item'];
      delete attrs['wx:for-index'];
    }

    return node;
  });
};

export const includeAndImportSrcExt = (): posthtml.Plugin<never> => tree => {
  tree.walk(node => {
    if ((node.tag === 'include' || node.tag === 'import') && node.attrs && node.attrs.src) {
      node.attrs.src = replaceExtPosix(node.attrs.src, '.swan');
    }

    return node;
  });
};

export const addBracketsToTemplateData = (): posthtml.Plugin<never> => tree => {
  tree.walk(node => {
    if (node.tag === 'template' && node.attrs && node.attrs.data) {
      node.attrs.data = `{${node.attrs.data.trim()}}`;
    }

    return node;
  });
};
