import { promisify } from 'util';
import { exec } from 'child_process';
import fs from 'fs';
import path from 'path';

describe('create-goji-app', () => {
  jest.setTimeout(5 * 60 * 1000);

  it('create project', async () => {
    // prepare
    const binPath = require.resolve('../../bin/create-goji-app');
    const workDir = '/tmp/.create-goji-app';
    await fs.promises.rmdir(workDir, { recursive: true });
    await fs.promises.mkdir(workDir, { recursive: true });
    const projectName = 'my-goji-app';
    const projectDir = path.join(workDir, projectName);

    // create project
    await promisify(exec)(`${binPath} ${projectName}`, { cwd: workDir });
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
