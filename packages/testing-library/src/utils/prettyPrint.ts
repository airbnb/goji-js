import prettyFormat, { plugins } from 'pretty-format';
import { ReactTestInstance } from 'react-test-renderer';
import { toJSON } from './toJson';

const { ReactTestComponent, ReactElement } = plugins;

export const prettyPrint = (element: ReactTestInstance, maxLength?: number) => {
  const enabledPlugins = [ReactTestComponent, ReactElement];

  const debugContent = prettyFormat(toJSON(element), {
    plugins: enabledPlugins,
    printFunctionName: false,
    highlight: true,
  });

  return maxLength !== undefined && debugContent && debugContent.toString().length > maxLength
    ? `${debugContent.slice(0, maxLength)}...`
    : debugContent;
};
