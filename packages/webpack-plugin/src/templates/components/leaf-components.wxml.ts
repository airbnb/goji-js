import { ComponentDesc } from '../../constants/components';
import { SimplifiedComponentDesc } from '../../utils/components';
import { PluginComponentDesc } from '../../utils/pluginComponent';
import { t } from '../helpers/t';
import { componentItem } from './components.wxml';

export const leafComponentWxml = ({
  components,
  simplifiedComponents,
  pluginComponents,
}: {
  components: Array<ComponentDesc>;
  simplifiedComponents: Array<SimplifiedComponentDesc>;
  pluginComponents: Array<PluginComponentDesc>;
}) => t`
    <block wx:if="{{false}}"></block>
    ${
      // render simplified components first for better performance
      [...simplifiedComponents, ...components, ...pluginComponents]
        .filter(_ => _.isLeaf)
        .map(component =>
          componentItem({
            component,
            // FIXME: remove this filed
            depth: -1,
            // FIXME: remove this filed
            componentsDepth: -1,
          }),
        )
    }
  `;
