let instanceCount = 0;

export const getNextInstanceId = () => {
  instanceCount += 1;
  return instanceCount;
};

export const resetInstanceId = () => {
  instanceCount = 0;
};
