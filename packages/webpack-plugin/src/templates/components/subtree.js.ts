import { t } from '../helper';

export const subtreeJs = () => {
  return t`
    Component({
      options: {
        addGlobalClass: true,
      },
      properties: {
        gojiId: {
          type: Number,
        },
        nodes: {
          type: Object,
        },
      },
      methods: {
        e(evt) {
          Object.e.trigger(evt);
        },
      },
      lifetimes: {
        attached() {
          Object.e.subtreeAttached(this.properties.gojiId, this);
        },
        detached() {
          Object.e.subtreeDetached(this.properties.gojiId);
        },
      },
    });
  `;
};
