import JSON5 from 'json5';
import unified from 'unified';
import parse from 'wx2swan/dist/src/view/plugins/parse';
import wxmlToSwan from 'wx2swan/dist/src/view//plugins/wxml-to-swan';
import stringify from 'wx2swan/dist/src/view/plugins/stringify';
import utils from 'wx2swan/dist/src/util';
import wx2swanApi from 'wx2swan/dist/src/api';
import wx2swanConfigApi from 'wx2swan/dist/config/wxmp2swan/api';
import { GojiWebpackPluginOptions } from '../../types';
import { handleTrackBy } from './baiduTrackBy';

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
          const pathname = 'baidu.wxml';
          const context = {
            type: 'wxmp2swan',
            src: '',
            dist: '',
            log: '',
            logs: [],
            data: { swanToRenamedComponents: {} },
          };
          const result = await unified()
            .use(parse)
            .use(wxmlToSwan, { context })
            .use(handleTrackBy as any)
            .use(stringify)
            .process(utils.toVFile(pathname, source));
          const contents = result.contents.toString();
          return contents;
        }
        case 'js': {
          const pathname = 'baidu.js';
          return wx2swanApi.transformApiContent(
            source,
            wx2swanConfigApi,
            'wx',
            {
              wx: 'swan',
            },
            pathname,
          );
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
