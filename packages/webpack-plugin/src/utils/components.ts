import { unstable_SimplifyComponent as SimplifyComponent, GojiTarget } from '@goji/core';
import camelCase from 'lodash/camelCase';
import kebabCase from 'lodash/kebabCase';
import pick from 'lodash/pick';
import { getBuiltInComponents, ComponentDesc } from '../constants/components';

export const getWhitelistedComponents = (
  target: GojiTarget,
  componentWhitelist?: Array<string>,
): ComponentDesc[] => {
  if (!componentWhitelist) {
    return getBuiltInComponents(target);
  }

  return getBuiltInComponents(target).filter(comp => componentWhitelist.includes(comp.name));
};

export interface SimplifiedComponentDesc extends ComponentDesc {
  sid: number;
}

export const getSimplifiedComponents = (
  components: Array<ComponentDesc>,
  simplifyComponents: Array<SimplifyComponent>,
): Array<SimplifiedComponentDesc> => {
  const simplifiedComponents: Array<ComponentDesc & { sid: number }> = [];
  for (const [index, { name, properties, events }] of simplifyComponents.entries()) {
    const matched = components.find(_ => _.name === name);
    if (!matched) {
      console.error(
        `component ${name} not found in BUILD_IN_COMPONENTS, maybe @goji/core and @goji/webpack-plugin version mismatched`,
      );
      continue;
    }
    simplifiedComponents.push({
      ...matched,
      events,
      props: pick(matched.props, properties.map(kebabCase)),
      sid: index,
    });
  }

  return simplifiedComponents;
};

export interface ComponentRenderData {
  name: string;
  isLeaf?: boolean;
  isWrapped?: boolean;
  sid?: number;
  events: string[];
  attributes: Array<{
    name: string;
    value: string;
    fallback?: any;
  }>;
}

// Baidu has a bug that we have to add default value for input's password
// swanide://fragment/543afd77cf5244addd3f67158948c8b71571973909208
const forceRenderFallback = (target: GojiTarget, componentName: string, propsName: string) => {
  if (target === 'baidu' && componentName === 'input' && propsName === 'password') {
    return true;
  }
  return false;
};

export const getRenderedComponents = (
  target: GojiTarget,
  simplifyComponents: Array<SimplifyComponent>,
  componentWhitelist?: Array<string>,
): Array<ComponentRenderData> => {
  const components = getWhitelistedComponents(target, componentWhitelist);
  const renderedComponents: Array<ComponentDesc | SimplifiedComponentDesc> = [
    ...getSimplifiedComponents(components, simplifyComponents),
    ...components,
  ];
  return renderedComponents.map(
    (component): ComponentRenderData => {
      return {
        name: component.name,
        isLeaf: component.isLeaf,
        isWrapped: component.isWrapped,
        sid: (component as SimplifiedComponentDesc).sid,
        events: component.events.map(eventName =>
          target === 'alipay' ? camelCase(`on-${eventName}`) : `bind${eventName.replace(/-/g, '')}`,
        ),
        attributes: Object.keys(component.props).map(propsName => {
          const desc = component.props[propsName];
          if (
            (desc && !desc.required && desc.value) ||
            forceRenderFallback(target, component.name, propsName)
          ) {
            return {
              name: propsName,
              value: camelCase(propsName),
              fallback: desc.value,
            };
          }

          return {
            name: propsName,
            value: camelCase(propsName),
          };
        }),
      };
    },
  );
};
