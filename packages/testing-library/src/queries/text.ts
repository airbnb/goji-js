import { ReactTestInstance } from 'react-test-renderer';
import { validComponentFilter, buildQueries } from '../utils/queryHelpers';

const getNodeText = (node: ReactTestInstance) => Array.from(node.children).join('');

const queryAllByText = (container: ReactTestInstance, text: string) =>
  container.findAll(node => validComponentFilter(node)).filter(node => getNodeText(node) === text);

const getMultipleError = (_container: ReactTestInstance, text: string) =>
  new Error(`Found multiple elements with the text: ${text}`);
const getMissingError = (_container: ReactTestInstance, text: string) =>
  new Error(
    `Unable to find an element with the text: ${text}. This could be because the text is broken up by multiple elements. In this case, you can provide a function for your text matcher to make your matcher more flexible.`,
  );

const [queryByText, getAllByText, getByText, findAllByText, findByText] = buildQueries(
  queryAllByText,
  getMultipleError,
  getMissingError,
);

export const byTextQueries = {
  queryByText,
  queryAllByText,
  getByText,
  getAllByText,
  findAllByText,
  findByText,
};
