import { ReactTestInstance } from 'react-test-renderer';
import { buildQueries, validComponentFilter } from '../utils/queryHelpers';

// this query match all valid elements
// it's useful to find the base elements
const queryAllByAny = (container: ReactTestInstance) => Array.from(container.findAll(node => validComponentFilter(node)));

const getMultipleError = () => new Error('Found multiple elements');
const getMissingError = () => new Error('Unable to find any element');

const [queryByAny, getAllByAny, getByAny, findAllByAny, findByAny] = buildQueries(
  queryAllByAny,
  getMultipleError,
  getMissingError,
);

export const byAnyQueries = {
  queryByAny,
  queryAllByAny,
  getAllByAny,
  getByAny,
  findAllByAny,
  findByAny,
};
