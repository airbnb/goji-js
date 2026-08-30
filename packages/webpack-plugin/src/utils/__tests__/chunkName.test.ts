import webpack from 'webpack';
import { getChunkName } from '../chunkName';

describe('getChunkName', () => {
  it('returns the chunk name when present', () => {
    expect(getChunkName({ name: 'main' } as webpack.Chunk)).toBe('main');
  });

  it('throws a descriptive error instead of recursing when the chunk has no name', () => {
    expect(() => getChunkName({ name: undefined } as unknown as webpack.Chunk)).toThrow(
      'getChunkName(chunk) expected string but got undefined',
    );
  });
});
