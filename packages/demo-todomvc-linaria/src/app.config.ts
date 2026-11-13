import { GojiTarget } from '@goji/core';

export default ({ target }: { target: GojiTarget }) => ({
  pages: ['pages/index/index', 'pages/about/index'],
  window: {
    backgroundTextStyle: 'dark',
    navigationBarBackgroundColor: '#ffffff',
    backgroundColor: '#ffffff',
    navigationBarTitleText: `TodoMVC Example ${target}`,
    navigationBarTextStyle: 'black',
  },
  // a custom tabBar is only supported on WeChat so far, `custom` is ignored by other targets
  ...(target === 'wechat'
    ? {
        tabBar: {
          custom: true,
          color: '#777777',
          selectedColor: '#af2f2f',
          backgroundColor: '#ffffff',
          list: [
            {
              pagePath: 'pages/index/index',
              iconPath: './image/icon_component.png',
              selectedIconPath: './image/icon_component_HL.png',
              text: 'Todos',
            },
            {
              pagePath: 'pages/about/index',
              iconPath: './image/icon_API.png',
              selectedIconPath: './image/icon_API_HL.png',
              text: 'About',
            },
          ],
        },
      }
    : {}),
});
