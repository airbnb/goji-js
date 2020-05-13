import { transformExtension } from '../transformExtension';

describe('transformExtension', () => {
  it('transform xml correctly', () => {
    expect(
      transformExtension({
        extension: '.wxml',
        miniProgramTarget: 'wechat',
      }),
    ).toEqual('.wxml');
    expect(
      transformExtension({
        extension: '.wxml',
        miniProgramTarget: 'alipay',
      }),
    ).toEqual('.axml');
  });
  it('transform css correctly', () => {
    expect(
      transformExtension({
        extension: '.wxss',
        miniProgramTarget: 'wechat',
      }),
    ).toEqual('.wxss');
    expect(
      transformExtension({
        extension: '.wxss',
        miniProgramTarget: 'baidu',
      }),
    ).toEqual('.css');
  });
  it('transform js correctly', () => {
    expect(
      transformExtension({
        extension: '.js',
        miniProgramTarget: 'wechat',
      }),
    ).toEqual('.js');
    expect(
      transformExtension({
        extension: '.js',
        miniProgramTarget: 'alipay',
      }),
    ).toEqual('.js');
  });
});
