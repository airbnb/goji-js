import { ReactNode } from 'react';

export abstract class Adaptor {
  public abstract run(element: ReactNode);
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
