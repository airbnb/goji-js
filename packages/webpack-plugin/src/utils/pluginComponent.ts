import { ComponentDesc } from '../constants/components';

export const pluginComponents = new Map<string, ComponentDesc>();

export const registerPluginComponent = (name: string, nativePath: string, props: Array<string>) => {
  if (pluginComponents.has(name)) {
    return;
  }
  // TODO: doesn't support events for now
  pluginComponents.set(name, {
    name,
    nativePath,
    props,
    events: [],
    isLeaf: true,
    isWrapped: false,
  });
};
