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
    await new Promise<webpack.Stats>((resolve, reject) => {
      compiler.run((err: Error, stats: webpack.Stats) => {
        if (err) {
          reject(err);
          return;
        }
        if (stats.hasErrors()) {
          reject(new Error(stats.compilation.errors[0].toString()));
          return;
        }
        resolve(stats);
      });
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
              .sort(),
          );
        });
      });

    // internal
    expect(await findAllFiles('this is internalA')).toEqual(['./packageA/_goji_commons.js']);

    // independent should works
    expect(await findAllFiles('this is sharedTop')).toEqual([
      './_goji_commons.js',
      './packageIndependent/_goji_commons.js',
    ]);

    // can nohoist
    expect(await findAllFiles('this is sharedA')).toEqual([
      './packageA/_goji_nohoist_ef694a33ef79da4db885e0bae648d1b0.js',
      './packageB/_goji_nohoist_ef694a33ef79da4db885e0bae648d1b0.js',
    ]);

    // nohoist can work with independent
    expect(await findAllFiles('this is sharedB')).toEqual([
      './packageA/_goji_nohoist_d1f973b3a1e95adb52e3162147042c71.js',
      './packageB/_goji_nohoist_d1f973b3a1e95adb52e3162147042c71.js',
      './packageIndependent/_goji_nohoist_d1f973b3a1e95adb52e3162147042c71.js',
    ]);
  });
});
