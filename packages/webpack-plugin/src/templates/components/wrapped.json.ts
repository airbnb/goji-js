import { ComponentDesc } from '../../constants/components';
import { PluginComponentDesc } from '../../utils/pluginComponent';
import { nativeComponentJson } from '../commons/nativeComponentJson';

export const wrappedJson = ({
  relativePathToBridge,
  component,
  components,
  pluginComponents,
}: {
  relativePathToBridge: string;
  component: ComponentDesc | PluginComponentDesc;
  components: ComponentDesc[];
  pluginComponents: PluginComponentDesc[];
}) =>
  nativeComponentJson({
    isComponent: true,
    isLeaf: component.isLeaf ?? false,
    relativePathToBridge,
    components,
    pluginComponents,
  });
