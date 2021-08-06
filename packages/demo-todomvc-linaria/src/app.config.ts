import { GojiTarget } from '@goji/core';

export default ({ target }: { target: GojiTarget }) => ({
    pages: ['pages/index/index'],
    window: {
      backgroundTextStyle: 'dark',
      navigationBarBackgroundColor: '#ffffff',
      backgroundColor: '#ffffff',
      navigationBarTitleText: `TodoMVC Example ${target}`,
      navigationBarTextStyle: 'black',
    },
  });
