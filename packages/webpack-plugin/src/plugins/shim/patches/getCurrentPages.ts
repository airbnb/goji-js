/**
 * the name of the `route` field in `getCurrentPages` is not unified on all platforms
 * |         | `route` | `__route__` |
 * | ------- | ------- | ----------- |
 * | WeChat  | ✓       | ✓           |
 * | QQ      | ✓       | ✓           |
 * | Baidu   | ✓       | ×           |
 * | Alipay  | ✓       | ×           |
 * | Toutiao | ×       | ✓           |
 * this file patches the `getCurrentPages` to make sure both two fields work correctly
 */

const originalGetCurrentPages =
  // eslint-disable-next-line no-undef
  typeof getCurrentPages !== 'undefined' ? getCurrentPages : undefined;

const patchGetCurrentPages = () =>
  function getCurrentPages(): any {
    const pages = originalGetCurrentPages!();
    if (pages) {
      return pages.map((page: any) => {
        if (!page) return page;

        // eslint-disable-next-line no-underscore-dangle
        const route = page.route ?? page.__route__;

        // some properties in `page` inherit from its prototype
        // you can try `Object.getOwnPropertyDescriptor(getCurrentPages()[0].__proto__.__proto__, 'data')`
        // to see that `page.data` is a inherited getter
        // in this case, we cannot use `Object.assign` or `{ ... }` because they only copy `own` properties
        return Object.create(page, {
          route: { writable: true, enumerable: true, configurable: true, value: route },
          __route__: { writable: true, enumerable: true, configurable: true, value: route },
        });
      });
    }

    return pages;
  };

module.exports = patchGetCurrentPages();
