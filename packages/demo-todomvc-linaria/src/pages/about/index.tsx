import React from 'react';
import { View, render } from '@goji/core';
import { css } from 'linaria';

const about = css`
  display: flex;
  flex-direction: column;
  padding: 40rpx;
  font-size: 28rpx;
  color: #777777;
`;

const title = css`
  margin-bottom: 20rpx;
  font-size: 40rpx;
  color: #af2f2f;
`;

const About = () => (
  <View className={about}>
    <View className={title}>Custom tabBar</View>
    <View>
      This page is rendered by GojiJS as a normal page, while the tabBar at the bottom is a custom
      component located at `custom-tab-bar/index`.
    </View>
  </View>
);

render(<About />);
