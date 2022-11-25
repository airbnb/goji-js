/**
 * @jest-environment node
 */
import path from 'path';
import findCacheDir from 'find-cache-dir';
import webpack from 'webpack';
import { execFile } from 'child_process';
import { rgPath } from 'vscode-ripgrep';

jest.setTimeout(60 * 1000);
// use source code
jest.mock('@goji/webpack-plugin', () => jest.requireActual('../../index.ts'));

describe('hoist', () => {
  test('full project', async () => {
    const basedir = path.join(__dirname, 'fixtures', 'hoist');
    const outputPath = findCacheDir({
      name: `test-nohoist`,
      cwd: __dirname,
    });
    // eslint-disable-next-line import/no-extraneous-dependencies, global-require
    const { getWebpackConfig } = require('@goji/cli/dist/cjs/config/webpack.config');
    // eslint-disable-next-line import/no-extraneous-dependencies, global-require
    const babelConfig = require('@goji/cli/dist/cjs/config/babel.config');
    const webpackConfig = getWebpackConfig({
      basedir,
      outputPath,
      target: 'wechat',
      nodeEnv: 'production',
      babelConfig,
      nohoist: {
        enable: true,
        maxPackages: Infinity,
      },
    });
    const compiler = webpack(webpackConfig);
    await new Promise<webpack.Stats | undefined>((resolve, reject) => {
      compiler.run((err, stats) => {
        if (err) {
          reject(err);
          return;
        }
        if (stats?.hasErrors()) {
          reject(new Error(stats.compilation.errors[0].toString()));
          return;
        }
        resolve(stats);
      });
    });
    await new Promise<undefined>(resolve => {
      compiler.close(() => resolve(undefined));
    });
    // checks
    const findAllFiles = (content: string) =>
      new Promise<Array<string>>((resolve, reject) => {
        execFile(rgPath, ['-l', content, '.'], { cwd: outputPath }, (err, stdout) => {
          if (err) {
            reject(err);
          }
          resolve(
            stdout
              .trim()
              .split('\n')
              .filter(_ => _.endsWith('.js'))
              .sort()
              // remove leading `./` or `.\\`
              .map(_ => path.join(_)),
          );
        });
      });

    // internal
    expect(await findAllFiles('this is internalA')).toEqual([
      path.join('packageA', '_goji_commons.js'),
    ]);

    // independent should works
    expect(await findAllFiles('this is sharedTop')).toEqual([
      path.join('_goji_commons.js'),
      path.join('packageIndependent', '_goji_commons.js'),
    ]);

    // can nohoist
    expect(await findAllFiles('this is sharedA')).toEqual([
      path.join(
        'packageA',
        '_goji_nohoist_ff2643de53ea9d153b61aebfbc33bf898fc70525cd1a310d1b77e91f2e3c7ebd.js',
      ),
      path.join(
        'packageB',
        '_goji_nohoist_ff2643de53ea9d153b61aebfbc33bf898fc70525cd1a310d1b77e91f2e3c7ebd.js',
      ),
    ]);

    // nohoist can work with independent
    expect(await findAllFiles('this is sharedB')).toEqual([
      path.join(
        'packageA',
        '_goji_nohoist_422804a4264f180279c5d813fe9ea6b0a1040c3908aa7da7ff5339f69063411f.js',
      ),
      path.join(
        'packageB',
        '_goji_nohoist_422804a4264f180279c5d813fe9ea6b0a1040c3908aa7da7ff5339f69063411f.js',
      ),
      path.join(
        'packageIndependent',
        '_goji_nohoist_422804a4264f180279c5d813fe9ea6b0a1040c3908aa7da7ff5339f69063411f.js',
      ),
    ]);
  });
});
