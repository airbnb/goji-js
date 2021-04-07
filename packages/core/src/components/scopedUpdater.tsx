import React, { createElement, CSSProperties, forwardRef } from 'react';
import { TYPE_SCOPE_UPDATER } from '../constants';
import { PublicInstance } from '../reconciler/publicInstance';

export type ScopedUpdaterProps = React.PropsWithChildren<{
  testID?: string;
  id?: string;
  className?: string;
  style?: CSSProperties;
}>;

const SelfScopedUpdater = (
  {
    className,
    style,
    ...restProps
  }: ScopedUpdaterProps,
  ref: React.Ref<PublicInstance>,
) => {
  return createElement(TYPE_SCOPE_UPDATER, {
    ref,
    className,
    style,
    ...restProps,
  });
};

const ScopedUpdater = forwardRef<PublicInstance, ScopedUpdaterProps>(SelfScopedUpdater);

ScopedUpdater.displayName = 'ScopedUpdater';

export { ScopedUpdater };

