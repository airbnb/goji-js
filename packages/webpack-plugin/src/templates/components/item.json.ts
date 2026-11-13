import { ComponentDesc } from '../../constants/components';
import { PluginComponentDesc } from '../../utils/pluginComponent';
import { nativeComponentJson } from '../commons/nativeComponentJson';

export const itemJson = ({
  relativePathToBridge,
  components,
  pluginComponents,
  isComponent = false,
}: {
  relativePathToBridge: string;
  components: ComponentDesc[];
  pluginComponents: PluginComponentDesc[];
  /**
   * Pages are rendered by `Page()` while custom tabBar entries are rendered by `Component()`,
   * which requires `"component": true` in their JSON file.
   */
  isComponent?: boolean;
}) =>
  nativeComponentJson({
    isComponent,
    isLeaf: false,
    relativePathToBridge,
    components,
    pluginComponents,
  });
