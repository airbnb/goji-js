import camelCase from 'lodash/camelCase';
import { ComponentDesc } from '../../constants/components';
import { getFeatures } from '../../constants/features';
import { PluginComponentDesc } from '../../utils/pluginComponent';
import { WRAPPED_CONFIGS, DEFAULT_WRAPPED_CONFIG } from '../commons/wrapped';
import { element, getEventName } from '../commons/wxmlElement';
import { CommonContext } from '../helpers/context';
import { getIds } from '../helpers/ids';
import { t } from '../helpers/t';
import { childrenWxml } from './children.wxml';
import { mapComponentPropsToAttributes, componentAttribute } from './components.wxml';

export const wrappedWxml = ({ component }: { component: ComponentDesc | PluginComponentDesc }) => {
  const ids = getIds();
  const { target } = CommonContext.read();
  const config = WRAPPED_CONFIGS[component.name] ?? DEFAULT_WRAPPED_CONFIG;
  const attributes: Array<string> = [
    `data-goji-id="{{${ids.meta}.${ids.gojiId} || -1}}"`,
    // common attributes
    componentAttribute({ name: 'class', value: 'className' }),
    componentAttribute({ name: 'id', value: 'id' }),
    componentAttribute({ name: 'style', value: 'style', fallback: '' }),
    ...mapComponentPropsToAttributes(component).map(_ =>
      config.memorizedProps?.includes(_.name)
        ? // element attributes with memorized
          `${_.name}="{{${camelCase(`internal-${_.name}`)}.value}}"`
        : // element attributes without memorized
          componentAttribute(_),
    ),
  ];

  // add events
  if ('events' in component) {
    for (const event of component.events) {
      const eventName = getEventName({ target, event });
      if (config.customizedEventHandler?.[event]) {
        attributes.push(`${eventName}="${camelCase(`on-${event}`)}"`);
      } else {
        attributes.push(`${eventName}="e"`);
      }
    }
  }

  const children = (() => {
    if (config.customizedChildren) {
      return config.customizedChildren();
    }
    if (component.isLeaf) {
      return '';
    }
    const { useInlineChildrenInItem } = getFeatures(CommonContext.read().target);
    if (useInlineChildrenInItem) {
      return childrenWxml({
        relativePathToBridge: '..',
        componentDepth: 0,
      });
    }
    return t`
      <include src="../children0.wxml" />
    `;
  })();

  return element({ tagName: component.name, attributes, children });
};
