import React, { ReactNode } from 'react';
import { View } from '@goji/core';
import cx from 'classnames';
import { useSelector, useDispatch } from 'react-redux';
import { setVisibilityFilter, StoreState, VisibilityFilterState } from '../duck/todo';
import styles from './Link.css';

interface Props {
  children: ReactNode;
  filter: string;
}

export const FilterLink = ({ children, filter }: Props) => {
  const visibilityFilter = useSelector((state: StoreState) => state.visibilityFilter);
  const dispatch = useDispatch();

  return (
    <View
      className={cx([filter === visibilityFilter && styles.selected, styles.filterLink])}
      onTap={() => dispatch(setVisibilityFilter(filter as VisibilityFilterState))}
    >
      {children}
    </View>
  );
};
