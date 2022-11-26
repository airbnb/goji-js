import { ReactNode } from 'react';
import './patchGlobalObject';
import { createAdaptor, AdaptorType, ExportComponentMeta } from './adaptor';
import { GojiTarget } from './constants';
import { batchedUpdates } from './reconciler';

interface RenderOptions {
  type: AdaptorType;
  disablePageSharing: boolean;
  exportMeta: ExportComponentMeta;
}

const DEFAULT_RENDER_OPTIONS: RenderOptions = {
  type: 'page',
  disablePageSharing: false,
  exportMeta: {},
};

export const render = (element: ReactNode, options: Partial<RenderOptions> = {}) => {
  const { type, exportMeta, disablePageSharing }: RenderOptions = {
    ...DEFAULT_RENDER_OPTIONS,
    ...options,
  };
  const adaptor = createAdaptor(
    type,
    process.env.GOJI_TARGET as GojiTarget,
    exportMeta,
    disablePageSharing,
  );
  return adaptor.run(element);
};

export * from './components/factoryComponents';
export { Subtree } from './components/subtree';
export { createPortal } from './portal';
export * from './lifecycles';
export * from './portal';
export {
  // eslint-disable-next-line camelcase
  SIMPLIFY_COMPONENTS as unstable_SIMPLIFY_COMPONENTS,
  // eslint-disable-next-line camelcase
  SimplifyComponent as unstable_SimplifyComponent,
  GojiTarget,
  // eslint-disable-next-line camelcase
  getTemplateIds as unstable_getTemplateIds,
} from './constants';
export { gojiEvents } from './events';
export { Partial } from './partial';
// eslint-disable-next-line camelcase
export { batchedUpdates as unstable_batchedUpdates };
export { PublicInstance as GojiPublicInstance } from './reconciler/publicInstance';
export { setGojiBlockingMode } from './container';
