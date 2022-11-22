import React from 'react';
import { MovableArea, MovableView, render } from '@goji/core';
import './index.css';

const TodoList = () => (
  <MovableArea>
    <MovableView direction="all" inertia>
      text
    </MovableView>
  </MovableArea>
);

render(<TodoList />);
