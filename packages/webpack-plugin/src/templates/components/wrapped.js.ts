import camelCase from 'lodash/camelCase';
import { ComponentDesc, ComponentPropDesc } from '../../constants/components';
import { PluginComponentDesc } from '../../utils/pluginComponent';
import { WRAPPED_CONFIGS, DEFAULT_WRAPPED_CONFIG, WrappedConfig } from '../commons/wrapped';
import { getIds } from '../helpers/ids';
import { t } from '../helpers/t';

const DEFAULT_VALUE_FROM_TYPE: Record<ComponentPropDesc['type'], any> = {
  String: '',
  Number: 0,
  Boolean: false,
  Object: {},
  Array: [],
};

/**
 * There are 2 types of props of a wrapped component:
 * 1. Most of props can be used directly in the wrapped component, e.g. `className`, `style`, `id`.
 * 2. Some props cause unexpected behaviors when re-rendering, e.g. the `current` prop of `swiper`.
 * For case 2, we need to memorize the value of the prop and update it only if it's really changed.
 */
export const processWrappedProps = ({
  component,
  config,
}: {
  component: ComponentDesc | PluginComponentDesc;
  config: WrappedConfig;
}) => {
  const ids = getIds();
  const data: Array<string> = [];
  const metaObserverChecks: Array<string> = [];
  const attachedInitData: Array<string> = [];

  for (const [propName, propDesc] of Object.entries(component.props)) {
    if (config.memorizedProps?.includes(propName)) {
      const camelCasePropName = camelCase(propName);
      const camelCaseInternalPropName = camelCase(`internal-${propName}`);
      const defaultValue = JSON.stringify(
        propDesc.defaultValue ?? DEFAULT_VALUE_FROM_TYPE[propDesc.type],
      );
      // we use `{ prop: { value: 'the value' } }` instead of `{ prop: 'the value' }` because
      // `setData` will fail if any field of the object is `undefined`.
      data.push(t`
        ${camelCaseInternalPropName}: {
          value: ${defaultValue}
        },
      `);
      attachedInitData.push(t`
        ${camelCaseInternalPropName}: {
          value: this.properties.${ids.meta}.${ids.props}.${camelCasePropName}
        },
      `);
      metaObserverChecks.push(t`
        if (this.properties.${ids.meta}.${ids.props}.${camelCasePropName} !== this.data.${camelCaseInternalPropName}.value) {
          update.${camelCaseInternalPropName} = {
            value: this.properties.${ids.meta}.${ids.props}.${camelCasePropName}
          };
        }
      `);
    }
  }

  const properties: Array<string> = [
    t`
      ${ids.meta}: {
        type: Object,
        observer() {
          var update = {};
          ${metaObserverChecks}
          if (Object.keys(update)) {
            this.setData(update);
          }
        },
      },
    `,
  ];

  return { data, properties, attachedInitData };
};

export const processWrappedEvents = ({
  component,
  config,
}: {
  component: ComponentDesc | PluginComponentDesc;
  config: WrappedConfig;
}) => {
  // add custom event handlers
  const methods: Array<string> = [
    t`
      e(evt) {
        Object.e.trigger(evt);
      },
    `,
  ];
  if ('events' in component) {
    for (const event of component.events) {
      if (config.customizedEventHandler?.[event]) {
        methods.push(config.customizedEventHandler[event]);
      }
    }
  }

  return { methods };
};

export const wrappedJs = ({ component }: { component: ComponentDesc | PluginComponentDesc }) => {
  const ids = getIds();
  const config = WRAPPED_CONFIGS[component.name] ?? DEFAULT_WRAPPED_CONFIG;
  const { data, properties, attachedInitData } = processWrappedProps({ config, component });
  const { methods } = processWrappedEvents({ config, component });

  return t`
    Component({
      options: {
        addGlobalClass: true,
      },
      data: {
        ${data}
      },
      properties: {
        ${properties}
      },
      lifetimes: {
        attached() {
          Object.e.subtreeAttached(this.properties.${ids.meta}.${ids.gojiId}, this);
          ${
            attachedInitData.length > 0 &&
            t`
            this.setData({
              ${attachedInitData}
            });
          `
          }
        },
        detached() {
          Object.e.subtreeDetached(this.properties.${ids.meta}.${ids.gojiId});
        },
      },
      methods: {
        ${methods}
      },
    });
  `;
};
