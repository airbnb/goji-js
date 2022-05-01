import * as Babel from '@babel/core';
import * as t from '@babel/types';
import { GojiWebpackPlugin } from '@goji/webpack-plugin/dist/cjs';
import { transformObjectASTToObject } from './utils/transformObjectASTToObject';

const isValidProps = (props: any) => {
  if (!Array.isArray(props)) {
    return false;
  }
  for (const prop of props) {
    if (typeof prop !== 'string') {
      if (!Array.isArray(prop) || prop.length > 2) {
        return false;
      }
      const [name, desc] = prop;
      if (typeof name !== 'string' || typeof desc !== 'object') {
        return false;
      }
    }
  }
  return true;
};

export const processRegisterPluginComponent = (
  config: { [key: string]: any } | undefined,
  nodes: Babel.NodePath<Babel.Node>[],
) => {
  const target = config?.target;
  if (!target) {
    throw new Error(
      'Cannot found `target` for macro config. This might be an internal error in GojiJS.',
    );
  }
  for (const node of nodes) {
    const callExpressionNode = node.parent;
    if (!t.isCallExpression(callExpressionNode)) {
      throw new Error('Wrong usage of `registerPluginComponent`');
    }
    let theArguments: Array<any>;
    try {
      theArguments = callExpressionNode.arguments.map(transformObjectASTToObject);
    } catch (e) {
      throw new Error(
        `Failed to parse the arguments of \`registerPluginComponent\`. ${(e as Error).message}`,
      );
    }
    if (theArguments.length < 3) {
      throw new Error('Wrong usage of `registerPluginComponent`');
    }
    const [componentTarget, componentName, componentPath, componentProps] = theArguments;
    if (typeof componentTarget !== 'string') {
      throw new Error(
        'The first argument of `registerPluginComponent` is `target` that should be type string',
      );
    }
    if (typeof componentName !== 'string') {
      throw new Error(
        'The second argument of `registerPluginComponent` is `name` that should be type string',
      );
    }
    if (typeof componentPath !== 'string') {
      throw new Error(
        'The third argument of `registerPluginComponent` is `path` that should be type string',
      );
    }
    if (!isValidProps(componentProps)) {
      throw new Error(
        'The forth argument of `registerPluginComponent` is `props` that should be type `Array<string | [string, PropDesc]>`',
      );
    }
    if (target === componentTarget) {
      GojiWebpackPlugin.internal_registerPluginComponent(
        componentName,
        componentPath,
        componentProps,
      );
    }
    // TODO: provide more info here, like returning a new component with readable `displayName`
    node.parentPath?.replaceWith(t.stringLiteral(componentName));
  }
};
