import { minimize } from '../minimize';

describe('minimize', () => {
  it('minimize .js file', async () => {
    expect(await minimize('(() => {const a = 1;\n console.log(a);})()', '.js')).toBe(
      'console.log(1);',
    );
  });

  it('minimize .json file', async () => {
    expect(await minimize(`{ "usingComponents": { "a": "a" } }`, '.json')).toBe(
      `{"usingComponents":{"a":"a"}}`,
    );
  });

  it('minimize .wxml file', async () => {
    expect(await minimize('<view \n class="{{props.className}}" >\n</view>', '.wxml')).toBe(
      '<view class="{{props.className}}"></view>',
    );
  });
});
