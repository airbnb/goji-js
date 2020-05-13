type TreeNode = {
  type: string;
  children: Array<TreeNode>;
  attribs: any;
};

function transformForDirective(node: TreeNode) {
  const { attribs } = node;
  if (attribs['s-for']) {
    const forValue = attribs['s-for'];
    const keyValue = attribs['s-key'];
    // to ignore the wrong usage of s-key
    if (!keyValue || keyValue.startsWith('{')) {
      return;
    }
    const [forItemName, forIndexName] = forValue.slice(0, forValue.indexOf(' in ')).split(',');
    if (keyValue === forItemName || keyValue === '*this') {
      attribs['s-for'] = `${forValue} trackBy ${forItemName}`;
    } else if (keyValue === forIndexName.trim()) {
      attribs['s-for'] = `${forValue} trackBy ${keyValue}`;
    } else {
      attribs['s-for'] = `${forValue} trackBy ${forItemName}.${keyValue}`;
    }
    delete attribs['s-key'];
  }
}

function transformTree(node: TreeNode | TreeNode[]): any {
  if (Array.isArray(node)) {
    return node.map(child => transformTree(child));
  }

  if (node.type === 'tag') {
    const { children } = node;
    node.children = children.map(child => transformTree(child));
    transformForDirective(node);
  }

  return node;
}

export const handleTrackBy = () => transformTree;
