import { GojiTarget } from '@goji/core';
import camelCase from 'lodash/camelCase';
import { ComponentDesc } from '../../../constants/components';
import { getFeatures } from '../../../constants/features';
import { AllComponentDesc, isWrapped, SimplifiedComponentDesc } from '../../../utils/components';
import { PluginComponentDesc } from '../../../utils/pluginComponent';
import {
  element,
  getComponentTagName,
  getConditionFromSidOrName,
  getEventName,
} from '../../commons/wxmlElement';
import { CommonContext } from '../../helpers/context';
import { getIds } from '../../helpers/ids';
import { t } from '../../helpers/t';
import { childrenWxml, noNeedImport } from '../children.wxml';
import { FlattenText, FlattenSwiper } from './flatten';

export const componentAttribute = ({
  name,
  value,
  fallback,
}: {
  name: string;
  value: string;
  fallback?: any;
}) => {
  const ids = getIds();
  switch (typeof fallback) {
    case 'undefined':
      return t`${name}="{{${ids.meta}.${ids.props}.${value}}}"`;
    case 'string':
      return t`${name}="{{${ids.meta}.${ids.props}.${value} || '${fallback}'}}"`;
    default:
      return t`${name}="{{${ids.meta}.${ids.props}.${value} === undefined ? ${JSON.stringify(
        fallback,
      )} : ${ids.meta}.${ids.props}.${value} }}"`;
  }
};

// FIXME: Baidu has a bug that we have to add default value for input's password
// swanide://fragment/543afd77cf5244addd3f67158948c8b71571973909208
const forceRenderFallback = (target: GojiTarget, componentName: string, propsName: string) => {
  if (target === 'baidu' && componentName === 'input' && propsName === 'password') {
    return true;
  }
  return false;
};

export const mapComponentPropsToAttributes = (component: AllComponentDesc) => {
  const { target } = CommonContext.read();
  return Object.entries(component.props).map(([name, desc]) => {
    if (
      (!desc.required && desc.defaultValue) ||
      forceRenderFallback(target, component.name, name)
    ) {
      return {
        name,
        value: camelCase(name),
        fallback: desc.defaultValue,
      };
    }

    return {
      name,
      value: camelCase(name),
    };
  });
};

export const componentAttributes = ({ component }: { component: AllComponentDesc }) => {
  const ids = getIds();
  const { target } = CommonContext.read();
  // all attributes should be handle inside the wrapped component
  if (isWrapped(component)) {
    return [`${ids.meta}="{{${ids.meta}}}"`];
  }

  return [
    `data-goji-id="{{${ids.meta}.${ids.gojiId} || -1}}"`,
    // common attributes
    componentAttribute({ name: 'class', value: 'className' }),
    componentAttribute({ name: 'id', value: 'id' }),
    componentAttribute({ name: 'style', value: 'style', fallback: '' }),
    // element attributes
    ...mapComponentPropsToAttributes(component).map(componentAttribute),
    // event event handlers
    ...('events' in component
      ? component.events.map(event => t`${getEventName({ target, event })}="e"`)
      : []),
  ];
};

export const useSubtreeAsChildren = Symbol('use subtree instead of children template');

export const componentItem = ({
  component,
  componentDepth,
  childrenDepth,
}: {
  component: AllComponentDesc;
  componentDepth: number;
  childrenDepth: number | typeof useSubtreeAsChildren;
}) => {
  const ids = getIds();
  const { useInlineChildrenInComponent } = getFeatures(CommonContext.read().target);
  const tagName = getComponentTagName(component);
  const attributes = componentAttributes({ component });
  const children = ((): string => {
    if (isWrapped(component) || component.isLeaf) {
      return '';
    }
    // cannot use <include> in <template> on Alipay
    // https://github.com/airbnb/goji-js/issues/140
    if (useInlineChildrenInComponent) {
      return childrenWxml({
        relativePathToBridge: noNeedImport,
        componentDepth,
      });
    }

    if (childrenDepth === useSubtreeAsChildren) {
      return t`
        <goji-subtree ${ids.meta}="{{${ids.meta}}}" />
      `;
    }

    return t`
      <include src="./children${childrenDepth}.wxml" />
    `;
  })();

  return t`
    <block wx:elif="{{${getConditionFromSidOrName(component)}}}">
      ${element({ tagName, attributes, children })}
    </block>
  `;
};

export const componentWxml = ({
  componentDepth,
  childrenDepth,
  useFlattenSwiper,
  components,
  simplifiedComponents,
  pluginComponents,
}: {
  componentDepth: number;
  childrenDepth: number | typeof useSubtreeAsChildren;
  useFlattenSwiper: boolean;
  components: Array<ComponentDesc>;
  simplifiedComponents: Array<SimplifiedComponentDesc>;
  pluginComponents: Array<PluginComponentDesc>;
}) => {
  const ids = getIds();
  const { useFlattenText } = getFeatures(CommonContext.read().target);

  return t`
    <template name="$$GOJI_COMPONENT${componentDepth}">
      <block wx:if="{{${ids.meta}.${ids.type} === 'GOJI_TYPE_TEXT'}}">{{${ids.meta}.${
    ids.text
  }}}</block>
      <block wx:elif="{{${ids.meta}.${ids.type} === 'GOJI_TYPE_SUBTREE'}}">
        <goji-subtree ${ids.meta}="{{${ids.meta}}}" class="{{${ids.meta}.${
    ids.props
  }.className}}" style="{{${ids.meta}.${ids.props}.style || ''}}"/>
      </block>
      ${useFlattenText && FlattenText()}
      ${useFlattenSwiper && FlattenSwiper()}
      ${
        // render simplified components first for better performance
        [...simplifiedComponents, ...components, ...pluginComponents]
          .filter(_ => !_.isLeaf)
          .map(component => componentItem({ component, componentDepth, childrenDepth }))
      }
      <block wx:else>
        <include src="./leaf-components.wxml" />
      </block>
    </template>
  `;
};
