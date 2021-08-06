import { ReactTestInstance } from 'react-test-renderer';
import { buildQueries, validComponentFilter } from '../utils/queryHelpers';

const queryAllByProp = (container: ReactTestInstance, propKey: string, propValue: string) => Array.from(
    container.findAll(node => validComponentFilter(node) && node.props[propKey]),
  ).filter(node => node.props[propKey] === propValue);

const getMultipleError = (_container: ReactTestInstance, propKey: string, propValue: string) =>
  new Error(`Found multiple elements with the ${propKey} of: ${propValue}`);
const getMissingError = (_container: ReactTestInstance, propKey: string, propValue: string) =>
  new Error(`Unable to find an element with the ${propKey} of: ${propValue}`);

const [queryByProp, getAllByProp, getByProp, findAllByProp, findByProp] = buildQueries(
  queryAllByProp,
  getMultipleError,
  getMissingError,
);

export const byPropQueries = {
  queryByProp,
  queryAllByProp,
  getAllByProp,
  getByProp,
  findAllByProp,
  findByProp,
};
