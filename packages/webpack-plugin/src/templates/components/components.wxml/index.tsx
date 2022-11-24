import { ComponentRenderData } from '../../../utils/components';
import { element, getComponentTagName, getConditionFromSidOrName } from '../../commons/wxmlElement';
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

export const componentAttributes = ({ component }: { component: ComponentRenderData }) => {
  const ids = getIds();
  const propsArray: Array<string> = [];
  if (component.isWrapped) {
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
  propsArray.push(...component.attributes.map(attribute => componentAttribute(attribute)));
  if (!component.isWrapped) {
    // wrapped components will handle event inside themselves
    propsArray.push(...component.events.map(event => t`${event}="e"`));
  }

  return propsArray;
};

export const componentItem = ({
  component,
  depth,
  componentsDepth,
}: {
  component: ComponentRenderData;
  depth: number;
  componentsDepth: number;
}) => {
  const ids = getIds();
  const inlineChildrenRender = CommonContext.read().target === 'alipay';
  const tagName = getComponentTagName(component);
  const attributes = componentAttributes({ component });
  const children = ((): string => {
    if (component.isWrapped || component.isLeaf) {
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
  componentsDepth,
}: {
  depth: number;
  useFlattenSwiper: boolean;
  components: Array<ComponentRenderData>;
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
      ${components.map(component => componentItem({ component, componentsDepth, depth }))}
      <block wx:else>
        <include src="./leaf-components.wxml" />
      </block>
    </template>
  `;
};
