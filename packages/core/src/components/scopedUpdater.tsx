import React, { createElement, CSSProperties, forwardRef, Fragment } from 'react';
import { TYPE_SCOPE_UPDATER, GOJI_TARGET } from '../constants';
import { PublicInstance } from '../reconciler/publicInstance';

const ENABLE_SCOPED_UPDATER = ['qq', 'wechat'].includes(GOJI_TARGET);

export type ScopedUpdaterProps = React.PropsWithChildren<{
  testID?: string;
  id?: string;
  // eslint-disable-next-line camelcase
  unsafe_className?: string;
  // eslint-disable-next-line camelcase
  unsafe_style?: CSSProperties;
}>;

const SelfScopedUpdater = (
  {
    unsafe_className: className,
    unsafe_style: style,
    ...props
  }: ScopedUpdaterProps,
  ref: React.Ref<PublicInstance>,
) => {
  const componentProps = {
    className,
    style,
    ...props,
  };
  if (ENABLE_SCOPED_UPDATER) {
    return createElement(TYPE_SCOPE_UPDATER, {
      ref,
      ...componentProps
    });
  }

  return createElement(Fragment, {
    ...componentProps
  });
};

const ScopedUpdater = forwardRef<PublicInstance, ScopedUpdaterProps>(SelfScopedUpdater);

ScopedUpdater.displayName = 'ScopedUpdater';

export { ScopedUpdater };
