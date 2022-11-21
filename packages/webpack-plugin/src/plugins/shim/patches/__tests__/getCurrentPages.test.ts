describe('patch `getCurrentPages`', () => {
  const ROUTE = 'path/to/page';
  let patchedGetCurrentPages: () => any;

  const mockProto = {
    get data() {
      return { dataA: 'a' };
    },
  };
  const mockPage: any = {
    __route__: ROUTE,
  };
  Object.setPrototypeOf(mockPage, mockProto);

  beforeAll(() => {
    global.getCurrentPages = () => [mockPage];
    // eslint-disable-next-line global-require
    patchedGetCurrentPages = require('../getCurrentPages');
  });

  afterAll(() => {
    // @ts-expect-error
    delete global.getCurrentPages;
  });

  it('patch `route` and `__route`', () => {
    const [page] = patchedGetCurrentPages();
    expect(page.route).toBe(ROUTE);
    // eslint-disable-next-line no-underscore-dangle
    expect(page.__route__).toBe(ROUTE);
  });

  it('works well with getter', () => {
    expect(mockPage.data.dataA).toBe('a');
    const [page] = patchedGetCurrentPages();
    expect(page.data.dataA).toBe('a');
  });
});
