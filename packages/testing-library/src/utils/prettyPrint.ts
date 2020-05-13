import prettyFormat from 'pretty-format';
import { ReactTestInstance } from 'react-test-renderer';
import { toJSON } from './toJson';

const { ReactTestComponent, ReactElement } = prettyFormat.plugins;

export const prettyPrint = (element: ReactTestInstance, maxLength?: number) => {
  const plugins = [ReactTestComponent, ReactElement];

  const debugContent = prettyFormat(toJSON(element), {
    plugins,
    printFunctionName: false,
    highlight: true,
  });

  return maxLength !== undefined && debugContent && debugContent.toString().length > maxLength
    ? `${debugContent.slice(0, maxLength)}...`
    : debugContent;
};
