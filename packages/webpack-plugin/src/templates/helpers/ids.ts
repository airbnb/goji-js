import { unstable_getTemplateIds as getTemplateIds } from '@goji/core';
import { CommonContext } from './context';

export const getIds = () => {
  const { nodeEnv } = CommonContext.read();
  return getTemplateIds(nodeEnv);
};
