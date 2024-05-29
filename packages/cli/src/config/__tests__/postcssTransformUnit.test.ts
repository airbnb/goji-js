import postcss from 'postcss';

describe('postcss-transform-unit', () => {
  test('px to rpx', async () => {
    const css = `
      .a {
        width: 10px;
        height: 20rpx;
        font-size: 30px; /* no */
      }
    `;

    const result = await postcss([
      // eslint-disable-next-line global-require
      require('../postcssTransformUnit')({
        divisor: 1,
        multiple: 2,
        sourceUnit: 'px',
        targetUnit: 'rpx',
      }),
    ]).process(css, {
      from: '/path/to/file.css',
    });
    expect(result.css).toMatchSnapshot();
  });

  test('rpx to px', async () => {
    const css = `
      .a {
        width: 10px;
        height: 20rpx;
        font-size: 30rpx; /* no */
      }
    `;

    const result = await postcss([
      // eslint-disable-next-line global-require
      require('../postcssTransformUnit')({
        divisor: 2,
        multiple: 1,
        sourceUnit: 'rpx',
        targetUnit: 'px',
      }),
    ]).process(css, {
      from: '/path/to/file.css',
    });
    expect(result.css).toMatchSnapshot();
  });
});
