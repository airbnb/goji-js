import camelCase from 'lodash/camelCase';
import { ComponentDesc } from '../../constants/components';
import { WRAPPED_CONFIGS, DEFAULT_WRAPPED_CONFIG } from '../commons/wrapped';
import { element, getEventName } from '../commons/wxmlElement';
import { CommonContext } from '../helpers/context';
import { t } from '../helpers/t';

export const wrappedWxml = ({ component }: { component: ComponentDesc }) => {
  const { target } = CommonContext.read();
  const config = WRAPPED_CONFIGS[component.name] ?? DEFAULT_WRAPPED_CONFIG;
  const attributes: Array<string> = [];
  attributes.push(
    'id="{{theId}}"',
    'class="{{className}}"',
    'style="{{theStyle}}"',
    'data-goji-id="{{gojiId}}"',
  );
  // add props
  for (const [propName] of Object.entries(component.props)) {
    if (config.memorizedProps?.includes(propName)) {
      attributes.push(`${propName}="{{${camelCase(`internal-${propName}`)}}}"`);
    } else {
      attributes.push(`${propName}="{{${camelCase(propName)}}}"`);
    }
  }

  // add events
  for (const event of component.events) {
    const eventName = getEventName({ target, event });
    if (config.customizedEventHandler?.[event]) {
      attributes.push(`${eventName}="${camelCase(`on-${event}`)}"`);
    } else {
      attributes.push(`${eventName}="e"`);
    }
  }

  const children = (() => {
    if (config.customizedChildren) {
      return config.customizedChildren;
    }
    if (component.isLeaf) {
      return '';
    }
    return t`
      <import src="../components0.wxml" />
      <block wx:for="{{nodes}}" wx:key="id">
        <template is="$$GOJI_COMPONENT0" data="{{ ...item }}" />
      </block>
    `;
  })();

  return element({ tagName: component.name, attributes, children });
};
