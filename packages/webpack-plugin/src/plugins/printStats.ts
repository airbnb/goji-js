import webpack from 'webpack';
import { GojiBasedWebpackPlugin } from './based';

export class GojiPrintStatsWebpackPlugin extends GojiBasedWebpackPlugin {
  public apply(compiler: webpack.Compiler) {
    compiler.hooks.done.tap('GojiPrintStatsWebpackPlugin', stats => {
      // eslint-disable-next-line no-console
      console.log();
      // eslint-disable-next-line no-console
      console.log(stats.toString(compiler.options.stats));
    });
  }
}
