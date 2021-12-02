// inspired from https://github.com/posthtml/posthtml-render/blob/47e750b67c27cb1f5b74bb38e419a31d97c7af6a/src/index.ts
import posthtml from 'posthtml';

const attrs = (object: posthtml.NodeAttributes) => {
  let attr = '';
  for (const [key, value] of Object.entries(object)) {
    if (typeof value === 'string') {
      if (value === '') {
        attr += ` ${key}`;
      } else {
        const attrValue = value;

        attr += ` ${key}="${attrValue}"`;
      }
    }
  }

  return attr;
};

export const render = (tree?: posthtml.Node | (string | posthtml.Node)[]): string => {
  if (!tree) {
    return '';
  }
  if (!Array.isArray(tree)) {
    return render([tree]);
  }

  let result = '';

  for (const node of tree) {
    if (!node) {
      continue;
    }
    if (typeof node === 'string') {
      result += node;
      continue;
    }

    if (!Array.isArray(node.content)) {
      node.content = node.content ? [node.content] : [];
    }

    const tag = node.tag ?? '';

    result += `<${tag}`;

    if (node.attrs) {
      result += attrs(node.attrs);
    }

    const contentRendered = render(node.content);
    if (!contentRendered.trim().length) {
      result += ' />';

      if (node.content) {
        result += contentRendered;
      }
    } else {
      result += `>${contentRendered}</${tag}>`;
    }
  }

  return result;
};
