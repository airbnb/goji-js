import { GojiTarget } from '@goji/core';

export default ({ target }: { target: GojiTarget }) => ({
    pages: ['pages/index/index'],
    window: {
      backgroundTextStyle: 'dark',
      navigationBarBackgroundColor: '#ffffff',
      backgroundColor: '#ffffff',
      navigationBarTitleText: `A GojiJS App on ${target}`,
      navigationBarTextStyle: 'black',
    },
  });
