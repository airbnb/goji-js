import { ComponentPropDesc } from '../constants/components';

const pluginComponents = new Map<string, PluginComponentDesc>();

export interface PluginComponentDesc {
  name: string;
  props: Record<string, ComponentPropDesc>;
  // TODO: doesn't support `events` for now
  nativePath: string;
  isLeaf?: boolean;
  // TODO: doesn't support `isWrapped` for now
}

export const registerPluginComponent = (name: string, nativePath: string, props: Array<string>) => {
  if (pluginComponents.has(name)) {
    return;
  }
  pluginComponents.set(name, {
    name,
    nativePath,
    props: props.reduce<Record<string, ComponentPropDesc>>(
      // FIXME: assume all props is String type here
      (propsDesc, prop) => ({ ...propsDesc, [prop]: { required: false, type: 'String' } }),
      {},
    ),
    isLeaf: true,
  });
};

export const getPluginComponents = () => [...pluginComponents.values()];
