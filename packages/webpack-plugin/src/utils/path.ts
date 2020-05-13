import path from 'path';
import { isUrlRequest, urlToRequest } from 'loader-utils';
import { BRIDGE_OUTPUT_PATH } from '../constants';

// ref: https://github.com/webpack/loader-utils#urltorequest
export const safeUrlToRequest = (url: string) => (isUrlRequest(url) ? urlToRequest(url) : url);

/**
 * @param pathname like `a/b/c`
 * @returns relativePathToBridge like `../../..`
 */
export const getRelativePathToBridge = (pathname: string, basrdir: string) => {
  if (pathname.startsWith('/')) {
    throw new Error('`pathname` should not be absolute path');
  }
  const relativePath = path.relative(path.dirname(pathname), basrdir);
  return safeUrlToRequest(path.join(relativePath, BRIDGE_OUTPUT_PATH));
};
