import { GojiTarget } from '@goji/core';

export default ({ target }: { target: GojiTarget }) => {
  const enableSwanSitemap = target === 'baidu';

  return {
    pages: ['pages/index/index'],
    subPackages: [
      enableSwanSitemap && {
        name: 'swan-sitemap',
        root: 'swan-sitemap',
        pages: ['index'],
      },
    ].filter(Boolean),
    window: {
      backgroundTextStyle: 'dark',
      navigationBarBackgroundColor: '#ffffff',
      backgroundColor: '#ffffff',
      navigationBarTitleText: `TodoMVC Example ${target}`,
      navigationBarTextStyle: 'black',
    },
    ...(enableSwanSitemap && {
      dynamicLib: {
        'swan-sitemap-lib': {
          provider: 'swan-sitemap',
        },
      },
    }),
  };
};
