import React, { useCallback } from 'react';
import cx from 'classnames';
import { View } from '@goji/core';
import styles from './Checkbox.css';

interface Props {
  className?: string;
  checked: boolean;
  onChange?: (checked: boolean) => {};
}

export const Checkbox = ({ className, onChange, checked }: Props) => {
  const onTap = useCallback(() => {
    if (onChange) {
      onChange(!checked);
    }
  }, [checked, onChange]);

  return (
    <View
      className={cx(className, styles.checkbox, checked ? styles.checked : styles.unchecked)}
      onTap={onTap}
    />
  );
};
