let instanceCount = 0;

export const getNextInstanceId = () => {
  instanceCount += 1;
  return instanceCount;
};

// eslint-disable-next-line camelcase
export const internal_resetInstanceId = () => {
  instanceCount = 0;
};
