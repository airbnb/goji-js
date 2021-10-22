export default () => ({
  pages: ['pages/index/index'],
  subPackages: [
    {
      name: 'packageA',
      root: 'packageA',
      pages: ['pages/index', 'pages/another'],
    },
    {
      name: 'packageB',
      root: 'packageB',
      pages: ['pages/index', 'pages/another'],
    },
    {
      name: 'packageIndependent',
      root: 'packageIndependent',
      pages: ['pages/index', 'pages/another'],
      independent: true,
    },
  ],
});
