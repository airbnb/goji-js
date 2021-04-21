import ReactReconciler from 'react-reconciler';
import { hostConfig } from './hostConfig';

// FIXME: remove `as any` after fixing `hostConfigTypes.ts`
export const reconciler = ReactReconciler(hostConfig as any);

const batchedUpdates = (reconciler.batchedUpdates as unknown) as <R>(fn: () => R) => void;

export { batchedUpdates };
