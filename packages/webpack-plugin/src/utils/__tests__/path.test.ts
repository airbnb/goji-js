import path from 'path';
import { getRelativePathToBridge, safeUrlToRequest } from '../path';
import { BRIDGE_OUTPUT_DIR } from '../../constants/paths';

describe('getRelativePathToBridge', () => {
  test('get correct relative path', () => {
    expect(getRelativePathToBridge('a/b/c', '.')).toBe(`../../${BRIDGE_OUTPUT_DIR}`);
    expect(getRelativePathToBridge('a/b', '.')).toBe(`../${BRIDGE_OUTPUT_DIR}`);
  });

  test('get correct relative path in independent package', () => {
    expect(getRelativePathToBridge('a/b/c', './a')).toBe(`../${BRIDGE_OUTPUT_DIR}`);
    expect(getRelativePathToBridge('a/b', './a')).toBe(`./${BRIDGE_OUTPUT_DIR}`);
  });

  test('relative path resovled to bridge path', () => {
    const resolveBridgePath = (pathname: string) => {
      const relativePathToBridge = getRelativePathToBridge(pathname, '.');
      return path.join(path.dirname(pathname), relativePathToBridge);
    };

    expect(resolveBridgePath('a/b/c')).toBe(BRIDGE_OUTPUT_DIR);
    expect(resolveBridgePath('a/b')).toBe(BRIDGE_OUTPUT_DIR);
    expect(resolveBridgePath('a')).toBe(BRIDGE_OUTPUT_DIR);
  });

  test('throw if absolute path', () => {
    expect(() => getRelativePathToBridge('/a/b/c', '.')).toThrow();
  });
});

describe('safeUrlToRequest', () => {
  test('convert relative path', () => {
    expect(safeUrlToRequest('myModule')).toBe('./myModule');
    expect(safeUrlToRequest('.hiddenModule')).toBe('./.hiddenModule');
    expect(safeUrlToRequest('../myModule')).toBe('../myModule');
  });

  test('do not convert absolute path', () => {
    expect(safeUrlToRequest('/path/to/myModule')).toBe('/path/to/myModule');
  });
});
