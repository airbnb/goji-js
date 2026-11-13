import { ReactNode } from 'react';

export abstract class Adaptor {
  public abstract run(element: ReactNode);
}

export abstract class AdaptorInstance {
  public abstract updateData(data: any, callback: () => void, renderId: string): void;
}

export type AdaptorType = 'page' | 'component' | 'exportComponent';

export interface ExportComponentMeta {
  props?: Array<string>;
  events?: Array<string>;
}

export interface ComponentMeta {
  /**
   * Native component options, see
   * https://developers.weixin.qq.com/miniprogram/dev/reference/api/Component.html
   */
  options?: Record<string, any>;
}
