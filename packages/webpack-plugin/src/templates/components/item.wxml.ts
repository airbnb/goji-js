import { getFeatures } from '../../constants/features';
import { CommonContext } from '../helpers/context';
import { t } from '../helpers/t';
import { childrenWxml } from './children.wxml';

export const itemWxml = ({ relativePathToBridge }: { relativePathToBridge: string }) => {
  const { useInlineChildrenInItem } = getFeatures(CommonContext.read().target);

  if (useInlineChildrenInItem) {
    return childrenWxml({
      relativePathToBridge,
      componentDepth: 0,
    });
  }

  return t`
    <include src="${relativePathToBridge}/children0.wxml" />
  `;
};
