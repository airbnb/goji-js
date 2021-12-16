import { promisify } from 'util';
import { exec } from 'child_process';
import rimraf from 'rimraf';
import fs from 'fs';
import path from 'path';
import os from 'os';

describe('create-goji-app', () => {
  jest.setTimeout(5 * 60 * 1000);

  // FIXME: re-enable after this version released
  it.skip('create project', async () => {
    // prepare
    const binPath = require.resolve('../../bin/create-goji-app');
    const workDir = path.join(os.tmpdir(), '.create-goji-app');
    // FIXME: use `fs.promises.rm` after upgrading to Node.js 14
    // await fs.promises.rm(workDir, { recursive: true, force: true });
    await promisify(rimraf)(workDir);
    await fs.promises.mkdir(workDir, { recursive: true });
    const projectName = 'my-goji-app';
    const projectDir = path.join(workDir, projectName);

    // create project
    await promisify(exec)(`node ${binPath} ${projectName}`, { cwd: workDir });
    expect(await fs.promises.stat(path.join(projectDir, 'package.json'))).toBeTruthy();
    /* eslint-disable global-require, import/no-dynamic-require */
    expect(require(path.join(projectDir, 'package.json')).dependencies['@goji/core']).toBe(
      `^${require('../../package.json').version}`,
    );
    /* eslint-enable global-require, import/no-dynamic-require */

    // run `yarn install`
    await promisify(exec)('yarn', { cwd: projectDir });

    // run `yarn build`
    await promisify(exec)('yarn build', { cwd: projectDir });
  });
});
