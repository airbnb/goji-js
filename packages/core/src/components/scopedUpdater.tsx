import React, { createElement, CSSProperties, Fragment } from 'react';
import { TYPE_SCOPE_UPDATER, GOJI_TARGET } from '../constants';

const useScopedUpdater = ['qq', 'wechat'].includes(GOJI_TARGET);

export type ScopedUpdaterProps = React.PropsWithChildren<{
  testID?: string;
  // eslint-disable-next-line camelcase
  unsafe_id?: string;
  // eslint-disable-next-line camelcase
  unsafe_className?: string;
  // eslint-disable-next-line camelcase
  unsafe_style?: CSSProperties;
}>;

export const ScopedUpdater = ({
  unsafe_id: id,
  unsafe_className: className,
  unsafe_style: style,
  children,
}: ScopedUpdaterProps) => {
  if (useScopedUpdater) {
    return createElement(TYPE_SCOPE_UPDATER, {
      id,
      className,
      style,
      children,
    });
  }

  return createElement(Fragment, { children });
};
