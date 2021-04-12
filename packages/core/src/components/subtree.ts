import React, { createElement, Fragment, CSSProperties } from 'react';
import { TYPE_SUBTREE, GOJI_TARGET } from '../constants';

export const useSubtree = GOJI_TARGET === 'wechat' || GOJI_TARGET === 'qq';

export const subtreeMaxDepth = ((process.env.GOJI_MAX_DEPTH as any) as number) ?? 10;

export const Subtree = ({
  unsafe_className: className,
  unsafe_style: style,
  ...restProps
}: // eslint-disable-next-line camelcase
React.PropsWithChildren<{ unsafe_className?: string; unsafe_style?: CSSProperties }>) => {
  if (useSubtree) {
    return createElement(useSubtree ? TYPE_SUBTREE : Fragment, {
      className,
      style,
      ...restProps,
    });
  }
  return createElement(Fragment, restProps);
};
