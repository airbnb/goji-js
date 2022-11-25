import { GojiTarget } from '@goji/core';
import camelCase from 'lodash/camelCase';
import { ComponentDesc } from '../../../constants/components';
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

const mapComponentPropsToAttributes = (component: AllComponentDesc) => {
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
  const propsArray: Array<string> = [];
  if (isWrapped(component)) {
    if (!component.isLeaf) {
      propsArray.push(`nodes="{{${ids.meta}.${ids.children}}}"`);
    }
    propsArray.push(
      `goji-id="{{${ids.meta}.${ids.gojiId} || -1}}"`,
      // use non-keywords to passthrough props to wrapped components
      componentAttribute({ name: 'class-name', value: 'className' }),
      componentAttribute({ name: 'the-id', value: 'id' }),
      componentAttribute({ name: 'the-style', value: 'style', fallback: '' }),
    );
  } else {
    propsArray.push(
      `data-goji-id="{{${ids.meta}.${ids.gojiId} || -1}}"`,
      componentAttribute({ name: 'class', value: 'className' }),
      componentAttribute({ name: 'id', value: 'id' }),
      componentAttribute({ name: 'style', value: 'style', fallback: '' }),
    );
  }
  propsArray.push(...mapComponentPropsToAttributes(component).map(componentAttribute));
  if (!isWrapped(component) && 'events' in component) {
    // wrapped components will handle event inside themselves
    propsArray.push(...component.events.map(event => t`${getEventName({ target, event })}="e"`));
  }

  return propsArray;
};

export const componentItem = ({
  component,
  depth,
  componentsDepth,
}: {
  component: AllComponentDesc;
  depth: number;
  componentsDepth: number;
}) => {
  const ids = getIds();
  const inlineChildrenRender = CommonContext.read().target === 'alipay';
  const tagName = getComponentTagName(component);
  const attributes = componentAttributes({ component });
  const children = ((): string => {
    if (isWrapped(component) || component.isLeaf) {
      return '';
    }
    if (inlineChildrenRender) {
      return t`
        <block wx:for="{{${ids.meta}.${ids.children}}}" wx:key="${ids.gojiId}">
          <template is="$$GOJI_COMPONENT${componentsDepth}" data="{{ ${ids.meta}: item }}" />
        </block>
      `;
    }

    return t`
      <include src="./children${depth}.wxml" />
    `;
  })();

  return t`
    <block wx:elif="{{${getConditionFromSidOrName(component)}}}">
      ${element({ tagName, attributes, children })}
    </block>
  `;
};

export const componentWxml = ({
  depth,
  useFlattenSwiper,
  components,
  simplifiedComponents,
  pluginComponents,
  componentsDepth,
}: {
  depth: number;
  useFlattenSwiper: boolean;
  components: Array<ComponentDesc>;
  simplifiedComponents: Array<SimplifiedComponentDesc>;
  pluginComponents: Array<PluginComponentDesc>;
  componentsDepth: number;
}) => {
  const ids = getIds();
  const useFlattenText = CommonContext.read().target === 'baidu';

  return t`
    <template name="$$GOJI_COMPONENT${depth}">
      <block wx:if="{{${ids.meta}.${ids.type} === 'GOJI_TYPE_TEXT'}}">{{${ids.meta}.${
    ids.text
  }}}</block>
      <block wx:elif="{{${ids.meta}.${ids.type} === 'GOJI_TYPE_SUBTREE'}}">
        <goji-subtree goji-id="{{${ids.meta}.${ids.gojiId}}}" nodes="{{${ids.meta}.${
    ids.children
  }}}" class="{{${ids.meta}.${ids.props}.className}}" style="{{${ids.meta}.${
    ids.props
  }.style || ''}}"/>
      </block>
      ${useFlattenText && FlattenText()}
      ${useFlattenSwiper && FlattenSwiper()}
      ${
        // render simplified components first for better performance
        [...simplifiedComponents, ...components, ...pluginComponents]
          .filter(_ => !_.isLeaf)
          .map(component => componentItem({ component, componentsDepth, depth }))
      }
      <block wx:else>
        <include src="./leaf-components.wxml" />
      </block>
    </template>
  `;
};
