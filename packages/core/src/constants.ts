export const TYPE_TEXT = 'GOJI_TYPE_TEXT';
export const TYPE_SUBTREE = 'GOJI_TYPE_SUBTREE';

export type GojiTarget = 'wechat' | 'baidu' | 'alipay' | 'toutiao' | 'qq' | 'toutiao';

export const GOJI_TARGET: GojiTarget = (process.env.GOJI_TARGET as GojiTarget) || 'wechat';

export interface SimplifyComponent {
  name: string;
  properties: Array<string>;
  events: Array<string>;
}

export const SIMPLIFY_COMPONENTS: Array<SimplifyComponent> = [
  {
    name: 'view',
    properties: ['className', 'style'],
    events: [],
  },
];
