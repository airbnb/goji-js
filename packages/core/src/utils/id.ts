let instanceCount = 0;

export const getNextInstanceId = () => {
  instanceCount += 1;
  return instanceCount;
};
