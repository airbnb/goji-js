import { ReactTestInstance, act } from 'react-test-renderer';
import { prettyPrint } from './prettyPrint';
import { waitForElement } from '../wait';

export const validComponentFilter = (node: ReactTestInstance) => typeof node.type === 'string';

interface QueryAllBy<T extends Array<any>> {
  (container: ReactTestInstance, ...args: T): Array<ReactTestInstance>;
}

interface QueryAllByError<T extends Array<any>> {
  (container: ReactTestInstance, ...args: T): Error;
}

function debugTree(container: ReactTestInstance) {
  const limit = process.env.DEBUG_PRINT_LIMIT ? parseInt(process.env.DEBUG_PRINT_LIMIT, 10) : 7000;

  return prettyPrint(container, limit);
}

function getElementError(message, container) {
  return new Error([message, debugTree(container)].filter(Boolean).join('\n\n'));
}

function getMultipleElementsFoundError(message, container) {
  return getElementError(
    `${message}\n\n(If this is intentional, then use the \`*AllBy*\` variant of the query (like \`queryAllByText\`, \`getAllByText\`, or \`findAllByText\`)).`,
    container,
  );
}

// accepts a query and returns a function that throws if more than one element is returned, otherwise
// returns the result or null
function makeSingleQuery<T extends Array<any>>(
  allQuery: QueryAllBy<T>,
  getMultipleError: QueryAllByError<T>,
) {
  return (container: ReactTestInstance, ...args: T) => {
    const els = allQuery(container, ...args);
    if (els.length > 1) {
      throw getMultipleElementsFoundError(getMultipleError(container, ...args), container);
    }
    return els[0] || null;
  };
}

// accepts a query and returns a function that throws if an empty list is returned
function makeGetAllQuery<T extends Array<any>>(
  allQuery: QueryAllBy<T>,
  getMissingError: QueryAllByError<T>,
) {
  return (container: ReactTestInstance, ...args: T) => {
    const els = allQuery(container, ...args);
    if (!els.length) {
      throw getElementError(getMissingError(container, ...args), container);
    }
    return els;
  };
}

// accepts a getter  and returns a function that calls waitForElement which invokes the getter.
function makeFindQuery<T extends Array<any>, R>(
  getter: (container: ReactTestInstance, ...args: T) => R,
): (container: ReactTestInstance, ...args: T) => Promise<R> {
  return async (container, ...args) => {
    let result: R;
    await act(async () => {
      result = await waitForElement(() => getter(container, ...args));
    });

    return result!;
  };
}

export function buildQueries<T extends Array<any>>(
  queryAllBy: QueryAllBy<T>,
  getMultipleError: QueryAllByError<T>,
  getMissingError: QueryAllByError<T>,
) {
  const queryBy = makeSingleQuery(queryAllBy, getMultipleError);
  const getAllBy = makeGetAllQuery(queryAllBy, getMissingError);
  const getBy = makeSingleQuery(getAllBy, getMultipleError);
  const findAllBy = makeFindQuery(getAllBy);
  const findBy = makeFindQuery(getBy);

  return [queryBy, getAllBy, getBy, findAllBy, findBy] as const;
}
