import { WeChatAdaptor } from './wechat';
import { Adaptor, AdaptorType, ComponentMeta, ExportComponentMeta } from './common';
import { GojiTarget } from '../constants';

export * from './common';

export const createAdaptor = (
  type: AdaptorType,
  target: GojiTarget,
  exportMeta: ExportComponentMeta,
  disablePageSharing: boolean,
  componentMeta: ComponentMeta = {},
): Adaptor => {
  switch (target) {
    case 'wechat':
      return new WeChatAdaptor(type, exportMeta, disablePageSharing, componentMeta);
    default:
      // FIXME: support other platforms
      return new WeChatAdaptor(type, exportMeta, disablePageSharing, componentMeta);
  }
};
