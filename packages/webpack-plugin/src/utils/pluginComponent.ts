import { ComponentDesc, ComponentPropDesc } from '../constants/components';

export const pluginComponents = new Map<string, ComponentDesc>();

export const registerPluginComponent = (name: string, nativePath: string, props: Array<string>) => {
  if (pluginComponents.has(name)) {
    return;
  }
  // TODO: doesn't support events for now
  pluginComponents.set(name, {
    name,
    nativePath,
    props: props.reduce<Record<string, ComponentPropDesc>>(
      // FIXME: assume all props is String type here
      (propsDesc, prop) => ({ ...propsDesc, [prop]: { required: false, type: 'String' } }),
      {},
    ),
    events: [],
    isLeaf: true,
    isWrapped: false,
  });
};
