import { GojiTarget } from '@goji/core';

const API_VARIABLE_NAME: Record<GojiTarget, string> = {
  wechat: 'wx',
  baidu: 'swan',
  alipay: 'my',
  qq: 'qq',
  toutiao: 'tt',
};

export const getApiVariableDefinitions = (target: GojiTarget) => {
  const targetVariable = API_VARIABLE_NAME[target];
  const definitions: Record<string, string> = {};
  for (const sourceVariable of Object.values(API_VARIABLE_NAME)) {
    definitions[sourceVariable] = targetVariable;
  }

  return definitions;
};
