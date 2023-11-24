import webpack from 'webpack';

export const getChunkName = (chunk: webpack.Chunk) => {
  if (!chunk.name) {
    throw new Error(`getChunkName(chunk) expected string but got ${typeof getChunkName(chunk)}`);
  }
  return chunk.name;
};
