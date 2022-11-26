import React, { createElement, Fragment, CSSProperties } from 'react';
import { TYPE_SUBTREE } from '../constants';

export const useSubtree = process.env.GOJI_TARGET === 'wechat' || process.env.GOJI_TARGET === 'qq';

export const subtreeMaxDepthFromConfig = (process.env.GOJI_MAX_DEPTH as any as number) ?? 10;

export const Subtree = ({
  unsafe_className: className,
  unsafe_style: style,
  ...restProps
}: React.PropsWithChildren<{ unsafe_className?: string; unsafe_style?: CSSProperties }>) => {
  if (useSubtree) {
    return createElement(TYPE_SUBTREE, {
      className,
      style,
      ...restProps,
    });
  }
  return createElement(Fragment, restProps);
};
