import yargs from 'yargs';
import { GojiTarget } from '@goji/core';

export interface CliConfig {
  target: GojiTarget;
  production: boolean;
  watch?: boolean;
  progress?: boolean;
}

const GOJI_TARGETS: Array<GojiTarget> = ['wechat', 'baidu', 'alipay', 'toutiao', 'qq', 'toutiao'];

export const parseArgv = (arg: Array<string>) => new Promise<CliConfig>((resolve, reject) => {
    const yargsConfig = yargs
      .command({
        command: 'start [target]',
        aliases: ['dev'],
        describe: 'Start Goji in development mode',
        builder: y =>
          y.positional('target', {
            describe: 'Target to build',
            choices: GOJI_TARGETS,
            default: 'wechat',
          }),
        handler: (parsedArgv: any) => {
          resolve({ ...parsedArgv, production: false });
        },
      })
      .command({
        command: 'build [target]',
        describe: 'Start Goji in production mode',
        builder: y =>
          y.positional('target', {
            describe: 'Target to build',
            choices: GOJI_TARGETS,
            default: 'wechat',
          }),
        handler: (parsedArgv: any) => {
          resolve({ ...parsedArgv, production: true });
        },
      })
      .option('watch', {
        alias: 'w',
        type: 'boolean',
        description: 'Run and watch codes',
      })
      .option('progress', {
        type: 'boolean',
        description: 'Print compilation progress in percentage',
      })
      // throw if command not found
      .strict()
      .demandCommand()
      .help();

    yargsConfig.parse(arg, (_err, _parsedArgv, output) => {
      if (output) {
        reject(new Error(output));
      }
      // resolve in command handlers
    });
  });
