import { GojiTarget } from '@goji/core';

export const transformExtension = ({
  extension,
  miniProgramTarget,
}: {
  extension: string;
  miniProgramTarget: GojiTarget;
}): string => {
  switch (miniProgramTarget) {
    case 'wechat':
      return extension;
    case 'qq':
      switch (extension) {
        case '.wxml':
          return '.qml';
        case '.wxss':
          return '.qss';
        default:
          return extension;
      }
    case 'baidu':
      switch (extension) {
        case '.wxml':
          return '.swan';
        case '.wxss':
          return '.css';
        default:
          return extension;
      }
    case 'alipay':
      switch (extension) {
        case '.wxml':
          return '.axml';
        case '.wxss':
          return '.acss';
        default:
          return extension;
      }
    case 'toutiao':
      switch (extension) {
        case '.wxml':
          return '.ttml';
        case '.wxss':
          return '.ttss';
        default:
          return extension;
      }
    default:
      return extension;
  }
};
