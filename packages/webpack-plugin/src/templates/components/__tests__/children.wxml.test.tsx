import { renderTemplate } from '../..';
import { childrenWxml } from '../children.wxml';

describe('children.wxml', () => {
  test('works', () => {
    expect(
      renderTemplate({ target: 'wechat', nodeEnv: 'development' }, () =>
        childrenWxml({
          relativePathToBridge: '.',
          componentDepth: 1,
        }),
      ),
    ).toMatchSnapshot();
  });
});
