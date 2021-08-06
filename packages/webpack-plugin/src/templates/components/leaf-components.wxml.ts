import { ComponentRenderData } from '../../utils/components';
import { t } from '../helpers/t';
import { componentItem } from './components.wxml';

export const leafComponentWxml = ({ components }: { components: ComponentRenderData[] }) => t`
    <block wx:if="{{false}}"></block>
    ${components.map(component =>
      componentItem({
        component,
        // FIXME: remove this filed
        depth: -1,
        // FIXME: remove this filed
        componentsDepth: -1,
      }),
    )}
  `;
