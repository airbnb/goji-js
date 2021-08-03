import camelCase from 'lodash/camelCase';
import { ComponentDesc, ComponentPropDesc } from '../../constants/components';
import { WRAPPED_CONFIGS, DEFAULT_WRAPPED_CONFIG, WrappedConfig } from '../commons/wrapped';
import { t } from '../helpers/t';

const DEFAULT_VALUE_FROM_TYPE: Record<ComponentPropDesc['type'], any> = {
  String: '',
  Number: 0,
  Boolean: false,
  Object: {},
  Array: [],
};

export const processWrappedProps = ({
  component,
  config,
}: {
  component: ComponentDesc;
  config: WrappedConfig;
}) => {
  const data: Array<string> = [];
  const properties: Array<string> = [
    t`
    theId: {
      type: String,
    },
    `,
    t`
    className: {
      type: String,
    },
    `,
    t`
    theStyle: {
      type: String,
    },
    `,
    t`
    gojiId: {
      type: Number,
    },
    `,
  ];
  if (!component.isLeaf) {
    properties.push(t`
      nodes: {
        type: Object,
      },
    `);
  }
  const attachedInitData: Array<string> = [];
  for (const [propName, propDesc] of Object.entries(component.props)) {
    const camelCasePropName = camelCase(propName);
    if (config.memorizedProps?.includes(propName)) {
      const camelCaseInternalPropName = camelCase(`internal-${propName}`);
      data.push(
        t`${camelCaseInternalPropName}: ${JSON.stringify(
          propDesc.defaultValue ?? DEFAULT_VALUE_FROM_TYPE[propDesc.type],
        )},`,
      );
      properties.push(t`
        ${camelCasePropName}: {
          type: ${propDesc.type},
          observer() {
            if (this.properties.${camelCasePropName} !== this.data.${camelCaseInternalPropName}) {
              this.setData({
                ${camelCaseInternalPropName}: this.properties.${camelCasePropName},
              });
            }
          },
        },
      `);
      attachedInitData.push(t`
        ${camelCaseInternalPropName}: this.properties.${camelCasePropName},
      `);
    } else {
      properties.push(t`
        ${camelCasePropName}: {
          type: ${propDesc.type},
        },
      `);
    }
  }

  return { data, properties, attachedInitData };
};

export const processWrappedEvents = ({
  component,
  config,
}: {
  component: ComponentDesc;
  config: WrappedConfig;
}) => {
  // add events
  const methods: Array<string> = [];
  for (const event of component.events) {
    if (config.customizedEventHandler?.[event]) {
      methods.push(config.customizedEventHandler[event]);
    }
  }

  return { methods };
};

export const wrappedJs = ({ component }: { component: ComponentDesc }) => {
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
          Object.e.subtreeAttached(this.properties.gojiId, this);
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
          Object.e.subtreeDetached(this.properties.gojiId);
        },
      },
      methods: {
        e(evt) {
          Object.e.trigger(evt);
        },
        ${methods}
      },
    });
  `;
};
