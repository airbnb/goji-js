import webpack from 'webpack';

// `webpack.css.cssMinify` pins `.css` via its own `filter`, which overrides `test`
// so we wrap it in a separate module to remove the `filter` field.
// https://github.com/webpack/webpack/blob/48738419ccd8a83d91da1088decece858a8cedb5/lib/css/cssMinify.js#L250
const webpackCssMinify = (...args: any[]): any =>
  webpack.css.cssMinify(...(args as Parameters<typeof webpack.css.cssMinify>));

export default webpackCssMinify;
