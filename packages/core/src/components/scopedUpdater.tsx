import React, { createElement, CSSProperties, forwardRef, Fragment } from 'react';
import { TYPE_SCOPE_UPDATER, GOJI_TARGET } from '../constants';
import { PublicInstance } from '../reconciler/publicInstance';

const ENABLE_SCOPED_UPDATER = ['qq', 'wechat'].includes(GOJI_TARGET);

export type ScopedUpdaterProps = React.PropsWithChildren<{
  testID?: string;
  id?: string;
  className?: string;
  style?: CSSProperties;
}>;

const SelfScopedUpdater = (
  props: ScopedUpdaterProps,
  ref: React.Ref<PublicInstance>,
) => {
  if (ENABLE_SCOPED_UPDATER) {
    return createElement(TYPE_SCOPE_UPDATER, {
      ref,
      ...props
    });
  }

  return createElement(Fragment, {
    ref,
    ...props
  });
};

const ScopedUpdater = forwardRef<PublicInstance, ScopedUpdaterProps>(SelfScopedUpdater);

ScopedUpdater.displayName = 'ScopedUpdater';

export { ScopedUpdater };
