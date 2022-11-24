import { GojiWebpackPluginRequiredOptions } from '../../types';
import { GojiBasedWebpackPlugin } from '../based';

class GojiTestWebpackPlugin extends GojiBasedWebpackPlugin {
  public apply() {
    // do nothing
  }

  // export protected methods
  public runTransformExt(extension: string) {
    return this.transformExt(extension);
  }

  public runTransformExtForPath(pathname: string) {
    return this.transformExtForPath(pathname);
  }

  public runIsJsExt(ext: string) {
    return this.isJsExt(ext);
  }

  public runIsCssExt(ext: string) {
    return this.isCssExt(ext);
  }
}

let wechatTestPugin: GojiTestWebpackPlugin;
let alipayTestPugin: GojiTestWebpackPlugin;
let baiduTestPugin: GojiTestWebpackPlugin;

describe('GojiBasedWebpackPlugin', () => {
  beforeAll(() => {
    const commonOptions: Omit<GojiWebpackPluginRequiredOptions, 'target'> = {
      maxDepth: 5,
      minimize: false,
      nohoist: { enable: true, maxPackages: 1, test: () => false },
      nodeEnv: 'development',
    };
    wechatTestPugin = new GojiTestWebpackPlugin({ ...commonOptions, target: 'wechat' });
    alipayTestPugin = new GojiTestWebpackPlugin({ ...commonOptions, target: 'alipay' });
    baiduTestPugin = new GojiTestWebpackPlugin({ ...commonOptions, target: 'baidu' });
  });

  test('transformExt', () => {
    expect(wechatTestPugin.runTransformExt('.wxss')).toBe('.wxss');
    expect(alipayTestPugin.runTransformExt('.wxss')).toBe('.acss');
    expect(baiduTestPugin.runTransformExt('.wxss')).toBe('.css');

    expect(wechatTestPugin.runTransformExt('.js')).toBe('.js');
    expect(alipayTestPugin.runTransformExt('.js')).toBe('.js');
    expect(baiduTestPugin.runTransformExt('.js')).toBe('.js');
  });

  test('transformExtForPath', () => {
    expect(wechatTestPugin.runTransformExtForPath('path/to/my.wxss')).toBe('path/to/my.wxss');
    expect(alipayTestPugin.runTransformExtForPath('path/to/my.wxss')).toBe('path/to/my.acss');
    expect(baiduTestPugin.runTransformExtForPath('path/to/my.wxss')).toBe('path/to/my.css');

    expect(wechatTestPugin.runTransformExtForPath('path/to/my.js')).toBe('path/to/my.js');
    expect(alipayTestPugin.runTransformExtForPath('path/to/my.js')).toBe('path/to/my.js');
    expect(baiduTestPugin.runTransformExtForPath('path/to/my.js')).toBe('path/to/my.js');
  });

  test('isJsExt', () => {
    expect(wechatTestPugin.runIsJsExt('.js')).toBe(true);
  });

  test('isCssExt', () => {
    expect(wechatTestPugin.runIsCssExt('.wxss')).toBe(true);
    expect(alipayTestPugin.runIsCssExt('.acss')).toBe(true);
    expect(baiduTestPugin.runIsCssExt('.css')).toBe(true);
  });
});
