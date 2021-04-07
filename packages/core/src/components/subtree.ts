import React, { createElement, Fragment, CSSProperties } from 'react';
import { TYPE_SUBTREE, GOJI_TARGET } from '../constants';

export const useSubtree = GOJI_TARGET === 'wechat' || GOJI_TARGET === 'qq';

export const subtreeMaxDepth = ((process.env.GOJI_MAX_DEPTH as any) as number) ?? 10;

export type SubtreeProps = React.PropsWithChildren<{
  testID?: string;
  // eslint-disable-next-line camelcase
  unsafe_id?: string;
  // eslint-disable-next-line camelcase
  unsafe_className?: string;
  // eslint-disable-next-line camelcase
  unsafe_style?: CSSProperties;
}>;

export const Subtree = ({
  unsafe_id: id,
  unsafe_className: className,
  unsafe_style: style,
  children,
}: SubtreeProps) => {
  if (useSubtree) {
    return createElement(TYPE_SUBTREE, {
      id,
      className,
      style,
      children,
    });
  }
  return createElement(Fragment, { children });
};
