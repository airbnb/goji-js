import { unstable_SimplifyComponent as SimplifyComponent, GojiTarget } from '@goji/core';
import kebabCase from 'lodash/kebabCase';
import pickBy from 'lodash/pickBy';
import { getBuiltInComponents, ComponentDesc } from '../constants/components';
import { PluginComponentDesc } from './pluginComponent';

/**
 * Filter out components that are not in the `usedComponents` array.
 * This function aims to optimize bundle size by only rendering needed components.
 */
export const getUsedComponents = (
  target: GojiTarget,
  usedComponents?: Array<string>,
): ComponentDesc[] => {
  const builtInComponents = getBuiltInComponents(target);
  return usedComponents
    ? builtInComponents.filter(comp => usedComponents.includes(comp.name))
    : builtInComponents;
};

export interface SimplifiedComponentDesc extends ComponentDesc {
  simplifiedId: number;
}

export const getSimplifiedComponents = (
  components: Array<ComponentDesc>,
  simplifyComponents: Array<SimplifyComponent>,
): Array<SimplifiedComponentDesc> => {
  const simplifiedComponents: Array<ComponentDesc & { simplifiedId: number }> = [];
  for (const [index, { name, properties, events }] of simplifyComponents.entries()) {
    const matched = components.find(_ => _.name === name);
    if (!matched) {
      console.error(
        `component ${name} not found in BUILD_IN_COMPONENTS, maybe @goji/core and @goji/webpack-plugin version mismatched`,
      );
      continue;
    }
    const simplifiedProperties = properties.map(kebabCase);
    simplifiedComponents.push({
      ...matched,
      events,
      props: pickBy(matched.props, (_propDesc, propName) =>
        simplifiedProperties.includes(propName),
      ),
      simplifiedId: index,
    });
  }

  return simplifiedComponents;
};

export type AllComponentDesc = ComponentDesc | SimplifiedComponentDesc | PluginComponentDesc;

export const isWrapped = (component: AllComponentDesc): boolean =>
  'isWrapped' in component && (component.isWrapped ?? true);
