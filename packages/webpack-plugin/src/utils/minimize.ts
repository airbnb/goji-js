import Minifier from 'html-minifier';
import Terser from 'terser';

const MINIMIZE_CONF = {
  caseSensitive: true,
  html5: true,
  removeComments: true,
  removeCommentsFromCDATA: true,
  removeCDATASectionsFromCDATA: true,
  collapseWhitespace: true,
  removeRedundantAttributes: true,
  removeEmptyAttributes: true,
  keepClosingSlash: true,
  removeScriptTypeAttributes: true,
  removeStyleLinkTypeAttributes: true,
};

export const minimize = (source: string, ext: string): string => {
  switch (ext) {
    case '.wxml':
      return Minifier.minify(source, MINIMIZE_CONF);
    case '.js': {
      const { code, error } = Terser.minify(source);
      if (error) {
        throw error;
      }
      return code || '';
    }
    case '.json':
      return JSON.stringify(JSON.parse(source));
    default:
      return source;
  }
};
