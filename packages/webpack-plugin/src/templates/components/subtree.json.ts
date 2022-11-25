import { ComponentDesc } from '../../constants/components';
import { PluginComponentDesc } from '../../utils/pluginComponent';
import { nativeComponentJson } from '../commons/nativeComponentJson';

export const subtreeJson = ({
  relativePathToBridge,
  components,
  pluginComponents,
}: {
  relativePathToBridge: string;
  components: ComponentDesc[];
  pluginComponents: PluginComponentDesc[];
}) =>
  nativeComponentJson({
    isComponent: true,
    isLeaf: false,
    relativePathToBridge,
    components,
    pluginComponents,
  });
