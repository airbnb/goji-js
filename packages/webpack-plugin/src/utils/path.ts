import path from 'path';
import { isUrlRequest, urlToRequest } from 'loader-utils';
import { BRIDGE_OUTPUT_DIR } from '../constants/paths';

// ref: https://github.com/webpack/loader-utils#urltorequest
export const safeUrlToRequest = (url: string) => (isUrlRequest(url) ? urlToRequest(url) : url);

/**
 * @param pathname like `a/b/c`
 * @returns relativePathToBridge like `../../..`
 */
export const getRelativePathToBridge = (pathname: string, basedir: string) => {
  if (pathname.startsWith('/')) {
    throw new Error('`pathname` should not be absolute path');
  }
  const relativePath = path.posix.relative(path.posix.dirname(pathname), basedir);
  return safeUrlToRequest(path.posix.join(relativePath, BRIDGE_OUTPUT_DIR));
};

// `replace-ext` using posix style
// forked from https://github.com/gulpjs/replace-ext/blob/fa419a29bd7c6347dbd695bbac00ec062ed4f70d/index.js
function startsWithSingleDot(fpath) {
  const first2chars = fpath.slice(0, 2);
  return first2chars === `.${path.sep}` || first2chars === './';
}

export const replaceExtPosix = (npath: string, ext: string) => {
  if (typeof npath !== 'string') {
    return npath;
  }

  if (npath.length === 0) {
    return npath;
  }

  const nFileName = path.posix.basename(npath, path.posix.extname(npath)) + ext;
  const nFilepath = path.posix.join(path.dirname(npath), nFileName);

  if (startsWithSingleDot(npath)) {
    return `.${path.sep}${nFilepath}`;
  }

  return nFilepath;
};
