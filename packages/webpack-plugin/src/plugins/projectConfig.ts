import webpack from 'webpack';
import CopyWebpackPlugin from 'copy-webpack-plugin';
import path from 'path';
import fs from 'fs';
import set from 'lodash/set';
import { promisify } from 'util';
import { GojiBasedWebpackPlugin } from './based';

type CopyPluginPatterns = Array<{
  from: string;
  to: string;
  transform?: (
    content: Buffer,
    path: string,
  ) => string | Buffer | Promise<string> | Promise<Buffer>;
}>;

export class GojiProjectConfigPlugin extends GojiBasedWebpackPlugin {
  public apply(compiler: webpack.Compiler) {
    const { target } = this.options;
    const patterns: CopyPluginPatterns = [];

    if (target === 'wechat' || target === 'qq') {
      patterns.push({
        from: 'sitemap.json',
        to: 'sitemap.json',
      });
    }

    if (target === 'wechat') {
      patterns.push({
        from: 'project.config.json',
        to: 'project.config.json',
        async transform(source) {
          const configData = JSON.parse(source.toString());

          // reserve original condition list
          try {
            const outputPath = compiler.options.output?.path;
            if (!outputPath) {
              throw new Error('compiler.options.output.path not found');
            }
            const originalContent = await promisify(fs.readFile)(
              path.join(outputPath, `project.config.json`),
            );
            const originalConfigData = JSON.parse(originalContent.toString());
            const originalList = originalConfigData.condition.miniprogram.list;
            if (originalList && originalList.length > 0) {
              set(configData, 'condition.miniprogram.list', originalList);
            }
          } catch (error) {
            // do nothing
          }

          return JSON.stringify(configData, null, '  ');
        },
      });
    }

    if (target === 'qq') {
      patterns.push({
        from: 'project.qq.json',
        to: 'project.config.json',
      });
    }

    if (target === 'baidu') {
      patterns.push({
        from: 'project.swan.json',
        to: 'project.swan.json',
      });
      // FIXME: use public folder
      patterns.push({
        from: 'skeleton/**/*',
        to: './',
      });
    }

    if (target === 'toutiao') {
      patterns.push({
        from: 'project.toutiao.json',
        to: 'project.config.json',
      });
    }

    if (patterns.length) {
      new CopyWebpackPlugin({
        patterns: patterns.map(pattern => ({ ...pattern, noErrorOnMissing: true })),
      }).apply(compiler);
    }
  }
}
