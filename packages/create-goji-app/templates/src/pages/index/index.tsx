import React from 'react';
import { render, View } from '@goji/core';
import styles from './index.css';

const Page = () => <View className={styles.goji}>Hello, world!</View>;

render(<Page />);
