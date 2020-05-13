import { parseArgv } from '../argv';

describe('parse argv', () => {
  test('start', async () => {
    const parsed = await parseArgv(['start']);
    expect(parsed.production).toBeFalsy();
    expect(parsed.target).toBe('wechat');
  });

  test('start [target]', async () => {
    const parsed = await parseArgv(['start', 'baidu']);
    expect(parsed.production).toBeFalsy();
    expect(parsed.target).toBe('baidu');
  });

  test('build', async () => {
    const parsed = await parseArgv(['build']);
    expect(parsed.production).toBeTruthy();
  });

  test('build [target]', async () => {
    const parsed = await parseArgv(['build', 'baidu']);
    expect(parsed.production).toBeTruthy();
    expect(parsed.target).toBe('baidu');
  });

  test('--progress', async () => {
    expect((await parseArgv(['start', '--progress'])).progress).toBeTruthy();
    expect((await parseArgv(['start', '--progress=no'])).progress).toBeFalsy();
  });

  test('--watch', async () => {
    expect((await parseArgv(['start', '--watch'])).watch).toBeTruthy();
    expect((await parseArgv(['start', '--watch=no'])).watch).toBeFalsy();
  });

  test('throw if wrong command', () => {
    expect(parseArgv(['bad', 'command'])).rejects.toBeTruthy();
  });
});
