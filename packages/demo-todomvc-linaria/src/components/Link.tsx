import React, { ReactNode } from 'react';
import { View } from '@goji/core';
import { css, cx } from 'linaria';
import { useSelector, useDispatch } from 'react-redux';
import { setVisibilityFilter, StoreState, VisibilityFilterState } from '../duck/todo';

const selected = css`
  border-color: rgba(175, 47, 47, 0.2) !important;
`;

const filterLink = css`
  color: inherit;
  margin: 3px;
  padding: 0 7px;
  text-decoration: none;
  border: 1px solid transparent;
  border-radius: 3px;
`;

interface Props {
  children: ReactNode;
  filter: string;
}

export const FilterLink = ({ children, filter }: Props) => {
  const visibilityFilter = useSelector((state: StoreState) => state.visibilityFilter);
  const dispatch = useDispatch();

  return (
    <View
      className={cx(filter === visibilityFilter && selected, filterLink)}
      onTap={() => dispatch(setVisibilityFilter(filter as VisibilityFilterState))}
    >
      {children}
    </View>
  );
};
