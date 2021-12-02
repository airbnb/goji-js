import JSON5 from 'json5';
import { GojiWebpackPluginOptions } from '../../types';
import { wxmlToSwan } from './wxmlToSwan';

export const transformTemplate = async (
  source: string,
  target: GojiWebpackPluginOptions['target'],
  type: string,
) => {
  if (type === 'json') {
    // format the JSON file
    return JSON.stringify(JSON5.parse(source), null, 2);
  }
  switch (target) {
    case 'wechat':
      return source;
    case 'qq':
      return source;
    case 'baidu': {
      switch (type) {
        case 'wxml': {
          return wxmlToSwan(source);
        }
        case 'js': {
          return source;
        }
        default:
          return source;
      }
    }
    case 'alipay':
      switch (type) {
        case 'wxml':
          return source.replace(/wx:/g, 'a:').replace(/\.wxml/g, '.axml');
        case 'js':
          return source;
        default:
          return source;
      }
    case 'toutiao':
      switch (type) {
        case 'wxml':
          return source.replace(/wx:/g, 'tt:').replace(/\.wxml/g, '.ttml');
        case 'wxss':
          // on Toutiao, after uglifying the `!important` doesn't work in some situations
          // for example `height:200px!important` and `color:red!important` fail
          return source.replace(/([^ ])!important/g, '$1 !important');
        default:
          return source;
      }
    default:
      return source;
  }
};
