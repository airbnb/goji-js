/* eslint-disable import/no-import-module-exports */
import findCacheDir from 'find-cache-dir';
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import mkdirp from 'mkdirp';

interface ICache {
  get: (key: string) => Promise<string>;
  set: (key: string, value: string) => Promise<void>;
}

const hashFileName = (name: string) => {
  const hash = crypto.createHash('sha256');
  hash.update(name);
  return hash.digest('hex');
};

class LinariaFileCache implements ICache {
  private linariaCacheDir: string;

  public constructor() {
    const linariaCacheDir = findCacheDir({
      name: `linaria-${process.env.NODE_ENV}-${process.env.GOJI_TARGET}`,
      cwd: process.cwd(),
    });
    if (!linariaCacheDir) {
      throw new Error('Get linaria cache dir failed');
    }
    mkdirp.sync(linariaCacheDir);
    this.linariaCacheDir = linariaCacheDir;
  }

  public async get(key) {
    return fs.promises.readFile(
      path.join(this.linariaCacheDir, `${hashFileName(key)}.css`),
      'utf8',
    );
  }

  public async set(key, value) {
    return fs.promises.writeFile(
      path.join(this.linariaCacheDir, `${hashFileName(key)}.css`),
      value,
      'utf8',
    );
  }
}

module.exports = new LinariaFileCache();
