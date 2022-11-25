import { ComponentDesc } from '../../constants/components';
import { PluginComponentDesc } from '../../utils/pluginComponent';
import { nativeComponentJson } from '../commons/nativeComponentJson';

export const itemJson = ({
  relativePathToBridge,
  components,
  pluginComponents,
}: {
  relativePathToBridge: string;
  components: ComponentDesc[];
  pluginComponents: PluginComponentDesc[];
}) =>
  nativeComponentJson({
    isComponent: false,
    isLeaf: false,
    relativePathToBridge,
    components,
    pluginComponents,
  });
