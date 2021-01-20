import React from 'react';
import { render } from '@goji/core';
import { registerPluginComponent } from '@goji/macro';

const SwanSitemapList = registerPluginComponent(
  'baidu',
  'swan-sitemap-list',
  'dynamicLib://swan-sitemap-lib/swan-sitemap-list',
  ['list-data', 'current-page', 'total-page', 'path'],
);

const listData = [
  {
    title: 'GojiJS',
    path: '/packageA/pages/details?id=1',
    releaseDate: '2021-1-1 00-00-00',
  },
  {
    title: 'Powered by',
    path: '/packageA/pages/details?id=2',
    releaseDate: '2021-1-2 00-00-00',
  },
  {
    title: 'Airbnb',
    path: '/packageA/pages/details?id=3',
    releaseDate: '2021-1-3 00-00-00',
  },
];

render(
  <SwanSitemapList
    listData={listData}
    currentPage={1}
    totalPage={500}
    path="/swan-sitemap/index"
  />,
);
