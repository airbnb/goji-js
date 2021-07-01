import { ComponentRenderData } from '../../utils/components';
import { t } from '../helper';
import { componentItem } from './components.wxml';

export const leafComponentWxml = ({ components }: { components: ComponentRenderData[] }) => {
  return t`
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
};
