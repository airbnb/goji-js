import { ReactTestInstance } from 'react-test-renderer';
import { validComponentFilter, buildQueries } from '../utils/queryHelpers';

// docs: https://testing-library.com/docs/queries/about/#textmatch
export type TextMatch = string | RegExp | ((text: string, node: ReactTestInstance) => boolean);

export interface ByTextOptions {
  exact?: boolean;
  trim?: boolean;
  collapseWhitespace?: boolean;
}

const getNodeText = (
  node: ReactTestInstance,
  { trim, collapseWhitespace }: { trim: boolean; collapseWhitespace: boolean },
): string => {
  let normalizedText = Array.from(node.children).join('');

  normalizedText = trim ? normalizedText.trim() : normalizedText;
  normalizedText = collapseWhitespace ? normalizedText.replace(/\s+/g, ' ') : normalizedText;

  return normalizedText;
};

const match = (
  text: string,
  node: ReactTestInstance,
  matcher: TextMatch,
  { exact }: { exact: boolean },
): boolean => {
  if (typeof matcher === 'string') {
    return exact ? text === matcher : text.toLowerCase().includes(matcher.toLowerCase());
  }
  if (matcher instanceof RegExp) {
    return matcher.test(text);
  }
  if (typeof matcher === 'function') {
    return matcher(text, node);
  }
  throw new Error(`ByText query only support string/RegRex as its first argument`);
};

const queryAllByText = (
  container: ReactTestInstance,
  text: TextMatch,
  { exact = true, trim = true, collapseWhitespace = true }: ByTextOptions = {},
) =>
  container
    .findAll(node => validComponentFilter(node))
    .filter(node => match(getNodeText(node, { trim, collapseWhitespace }), node, text, { exact }));

const getMultipleError = (
  _container: ReactTestInstance,
  text: TextMatch,
  _options?: ByTextOptions,
) => new Error(`Found multiple elements with the text: ${text}`);

const getMissingError = (
  _container: ReactTestInstance,
  text: TextMatch,
  _options?: ByTextOptions,
) =>
  new Error(
    `Unable to find an element with the text: ${JSON.stringify(
      text,
    )}. This could be because the text is broken up by multiple elements. In this case, you can provide a function for your text matcher to make your matcher more flexible.`,
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
