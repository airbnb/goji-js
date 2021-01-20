import * as t from '@babel/types';

/**
 * this method convert the Babel AST tree of a object to a real JavaScript object
 * only pure objects are accepted
 */
export const transformObjectASTToObject = (node: t.Node | null) => {
  if (
    t.isStringLiteral(node) ||
    t.isNumericLiteral(node) ||
    t.isBooleanLiteral(node) ||
    t.isDecimalLiteral(node)
  ) {
    return node.value;
  }
  if (t.isNullLiteral(node)) {
    return null;
  }
  if (t.isIdentifier(node) && node.name === 'undefined') {
    return undefined;
  }
  if (t.isArrayExpression(node)) {
    return node.elements.map(element => transformObjectASTToObject(element));
  }
  if (t.isObjectExpression(node)) {
    const obj = {};
    for (const property of node.properties) {
      if (!t.isObjectProperty(property)) {
        throw new Error('`transformObjectASTToObject` only support pure object');
      }
      if (property.computed) {
        throw new Error("`transformObjectASTToObject` doesn't support computed properties");
      }
      if (property.shorthand) {
        throw new Error("`transformObjectASTToObject` doesn't support shorthand properties");
      }
      const propertyKey = property.key;
      if (
        !(
          t.isIdentifier(propertyKey) ||
          t.isStringLiteral(propertyKey) ||
          t.isNumericLiteral(propertyKey) ||
          t.isDecimalLiteral(propertyKey)
        )
      ) {
        throw new Error('`transformObjectASTToObject` only support pure object');
      }
      const propertyKeyString = t.isIdentifier(propertyKey) ? propertyKey.name : propertyKey.value;
      obj[propertyKeyString] = transformObjectASTToObject(property.value);
    }
    return obj;
  }
  throw new Error('`transformObjectASTToObject` only support pure object');
};
