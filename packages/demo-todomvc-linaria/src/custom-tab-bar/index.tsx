import React from 'react';
import { View, Image, render, useTabBar } from '@goji/core';
import { css, cx } from 'linaria';
import iconComponent from '../image/icon_component.png';
import iconComponentHL from '../image/icon_component_HL.png';
import iconAPI from '../image/icon_API.png';
import iconAPIHL from '../image/icon_API_HL.png';

// `tabBar.list[].iconPath` is a build-time config field, so keep a mapping here instead.
// The order must match `tabBar.list` in `app.config.ts`.
const ICONS = [
  { icon: iconComponent, selectedIcon: iconComponentHL },
  { icon: iconAPI, selectedIcon: iconAPIHL },
];

const tabBar = css`
  position: fixed;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 1000;
  display: flex;
  flex-direction: row;
  height: 100rpx;
  padding-bottom: env(safe-area-inset-bottom);
  background-color: #ffffff;
  border-top: 1rpx solid #e6e6e6;
`;

const tabItem = css`
  display: flex;
  flex: 1;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  font-size: 20rpx;
  color: #777777;
`;

const selectedItem = css`
  color: #af2f2f;
`;

const icon = css`
  width: 54rpx;
  height: 54rpx;
  margin-bottom: 6rpx;
`;

const TabBar = () => {
  const { list, selected, switchTab } = useTabBar();

  return (
    <View className={tabBar}>
      {list.map((item, index) => {
        const icons = ICONS[index];
        return (
          <View
            key={item.pagePath}
            className={cx(tabItem, index === selected && selectedItem)}
            onTap={() => switchTab(index)}
          >
            {icons ? (
              <Image className={icon} src={index === selected ? icons.selectedIcon : icons.icon} />
            ) : null}
            {item.text}
          </View>
        );
      })}
    </View>
  );
};

// `custom-tab-bar/index` is a custom component rather than a page
render(<TabBar />, { type: 'component' });
