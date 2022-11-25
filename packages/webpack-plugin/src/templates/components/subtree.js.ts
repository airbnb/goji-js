import { getIds } from '../helpers/ids';
import { t } from '../helpers/t';

export const subtreeJs = () => {
  const ids = getIds();

  return t`
    Component({
      options: {
        addGlobalClass: true,
      },
      properties: {
        ${ids.meta}: {
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
          Object.e.subtreeAttached(this.properties.${ids.meta}.${ids.gojiId}, this);
        },
        detached() {
          Object.e.subtreeDetached(this.properties.${ids.meta}.${ids.gojiId});
        },
      },
    });
  `;
};
