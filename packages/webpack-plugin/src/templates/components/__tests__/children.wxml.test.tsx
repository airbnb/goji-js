import { renderTemplate } from '../..';
import { childrenWxml } from '../children.wxml';

describe('children.wxml', () => {
  test('works on wechat', () => {
    expect(
      renderTemplate({ target: 'wechat', nodeEnv: 'development' }, () =>
        childrenWxml({
          componentsDepth: 1,
          maxDepth: 5,
        }),
      ),
    ).toMatchSnapshot();
  });

  test('fix Baidu undefined not work bug', () => {
    expect(
      renderTemplate({ target: 'baidu', nodeEnv: 'development' }, () =>
        childrenWxml({
          componentsDepth: 1,
          maxDepth: 5,
        }),
      ),
    ).toContain('data="{{ meta: item }}"');
  });

  test('reach max depth', () => {
    expect(
      renderTemplate({ target: 'wechat', nodeEnv: 'development' }, () =>
        childrenWxml({
          componentsDepth: 5,
          maxDepth: 5,
        }),
      ),
    ).toMatchSnapshot();
  });
});
