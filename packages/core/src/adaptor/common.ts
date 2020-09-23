import { ReactNode } from 'react';
import { RootTag } from '../render';

export abstract class Adaptor {
  public abstract run(element: ReactNode, rootTag?: RootTag);
}

export abstract class AdaptorInstance {
  public abstract updateData(data: any, callback: () => void, renderId: string): void;

  public abstract registerEventHandling(handlerKey: string, handler: Function): void;

  public abstract unregisterEventHandler(handlerKey: string): void;
}

export type AdaptorType = 'page' | 'component' | 'exportComponent';

export interface ExportComponentMeta {
  props?: Array<string>;
  events?: Array<string>;
}
