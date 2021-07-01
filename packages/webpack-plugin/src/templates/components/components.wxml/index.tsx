import { ComponentRenderData } from '../../../utils/components';
import { CommonContext } from '../../context';
import { t } from '../../helper';
import { FlattenText, FlattenSwiper } from './flatten';

export const getConditionFromSidOrName = ({ sid, name }: { sid?: number; name: string }) =>
  sid === undefined ? t`type === '${name}'` : t`sid === ${sid}`;

export const getComponentTagName = ({ isWrapped, name }: { isWrapped?: boolean; name: string }) =>
  t`${isWrapped && 'goji-'}${name}`;

export const componentAttribute = ({
  name,
  value,
  fallback,
}: {
  name: string;
  value: string;
  fallback?: any;
}) => {
  switch (typeof fallback) {
    case 'undefined':
      return t`${name}="{{props.${value}}}"`;
    case 'string':
      return t`${name}="{{props.${value} || '${fallback}'}}"`;
    default:
      return t`${name}="{{props.${value} === undefined ? ${JSON.stringify(
        fallback,
      )} : props.${value} }}"`;
  }
};

export const componentAttributes = ({ component }: { component: ComponentRenderData }) => {
  const propsArray: Array<string> = [];
  if (component.isWrapped) {
    if (!component.isLeaf) {
      propsArray.push('nodes="{{c}}"');
    }
    propsArray.push(
      'goji-id="{{id || -1}}"',
      // use non-keywords to passthrough props to wrapped components
      componentAttribute({ name: 'class-name', value: 'className' }),
      componentAttribute({ name: 'the-id', value: 'id' }),
      componentAttribute({ name: 'the-style', value: 'style', fallback: '' }),
    );
  } else {
    propsArray.push(
      'data-goji-id="{{id || -1}}"',
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

export const element = ({
  tagName,
  attributes,
  children,
}: {
  tagName: string;
  attributes: Array<string>;
  children: string;
}) => {
  if (!children) {
    return t`
      <${tagName}
        ${attributes}
      />
    `;
  }

  return t`
    <${tagName}
      ${attributes}
    >
      ${children}
    </${tagName}>
  `;
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
  const inlineChildrenRender = CommonContext.read().target === 'alipay';
  const tagName = getComponentTagName(component);
  const attributes = componentAttributes({ component });
  const children = ((): string => {
    if (component.isWrapped || component.isLeaf) {
      return '';
    }
    if (inlineChildrenRender) {
      return t`
        <block wx:for="{{c}}" wx:key="id">
          <template is="$$GOJI_COMPONENT${componentsDepth}" data="{{ ...item }}" />
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
  const useFlattenText = CommonContext.read().target === 'baidu';

  return t`
    <template name="$$GOJI_COMPONENT${depth}">
      <block wx:if="{{type === 'GOJI_TYPE_TEXT'}}">{{text}}</block>
      <block wx:elif="{{type === 'GOJI_TYPE_SUBTREE'}}">
        <goji-subtree goji-id="{{id}}" nodes="{{c}}" class="{{props.className}}" style="{{props.style || ''}}"/>
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
