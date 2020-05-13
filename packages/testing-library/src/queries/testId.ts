import { ReactTestInstance } from 'react-test-renderer';
import { byPropQueries } from './prop';
import { buildQueries } from '../utils/queryHelpers';

const queryAllByTestId = (container: ReactTestInstance, testId: string) =>
  byPropQueries.queryAllByProp(container, 'testID', testId);

const getMultipleError = (_container: ReactTestInstance, testId: string) =>
  new Error(`Found multiple elements with the testID of: ${testId}`);
const getMissingError = (_container: ReactTestInstance, testId: string) =>
  new Error(`Unable to find an element with the testID of: ${testId}`);

const [queryByTestId, getAllByTestId, getByTestId, findAllByTestId, findByTestId] = buildQueries(
  queryAllByTestId,
  getMultipleError,
  getMissingError,
);

export const byTestIdQueries = {
  queryByTestId,
  queryAllByTestId,
  getByTestId,
  getAllByTestId,
  findAllByTestId,
  findByTestId,
};
