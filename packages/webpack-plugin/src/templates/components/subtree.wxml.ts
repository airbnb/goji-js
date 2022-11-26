import { getFeatures } from '../../constants/features';
import { CommonContext } from '../helpers/context';
import { t } from '../helpers/t';
import { childrenWxml } from './children.wxml';

export const subtreeWxml = () => {
  const { useInlineChildrenInItem } = getFeatures(CommonContext.read().target);

  if (useInlineChildrenInItem) {
    return childrenWxml({
      relativePathToBridge: '.',
      componentDepth: 0,
    });
  }

  return t`
    <include src="./children0.wxml" />
  `;
};
