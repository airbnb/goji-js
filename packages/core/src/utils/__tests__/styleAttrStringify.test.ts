import { styleAttrStringify } from '../styleAttrStringify';

describe('styleAttrStringify', () => {
  test('invalid values', () => {
    expect(styleAttrStringify(undefined)).toBe('');
    expect(styleAttrStringify({})).toBe('');
    // @ts-expect-error
    expect(styleAttrStringify({ width: null, height: undefined, top: 0 })).toBe('top:0;');
  });

  test('common styles', () => {
    expect(
      styleAttrStringify({
        color: 'white',
        border: '1px solid red',
      }),
    ).toStrictEqual('color:white;border:1px solid red;');
    expect(
      styleAttrStringify({
        backgroundColor: 'yellow',
      }),
    ).toStrictEqual('background-color:yellow;');
    expect(
      styleAttrStringify({
        flexDirection: 'row-reverse',
        alignItems: 'flex-start',
      }),
    ).toStrictEqual('flex-direction:row-reverse;align-items:flex-start;');
  });

  test('vendor prefix', () => {
    expect(
      styleAttrStringify({
        WebkitTransform: 'rotate(90deg)',
      }),
    ).toBe('-webkit-transform:rotate(90deg);');
  });

  test('calc', () => {
    expect(
      styleAttrStringify({
        width: 'calc(100% - 30px)',
        height: 'calc(100vh - 80px)',
      }),
    ).toStrictEqual('width:calc(100% - 30px);height:calc(100vh - 80px);');
  });
});
