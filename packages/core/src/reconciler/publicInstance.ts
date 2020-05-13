import { ElementInstance } from './instance';

export type ComponentInstance = any;

export interface PublicInstance {
  // eslint-disable-next-line camelcase
  unsafe_originalInstance: ElementInstance;
  // eslint-disable-next-line camelcase
  unsafe_gojiId: number;
  getComponentInstance: () => Promise<ComponentInstance>;
}

export const subtreeInstances = new Map<number, ComponentInstance>();
