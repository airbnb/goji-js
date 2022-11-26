import { ElementInstance } from '../instance';
import { Container } from '../../container';
import { GOJI_VIRTUAL_ROOT, TYPE_SUBTREE } from '../../constants';
import { TestingAdaptorInstance } from '../../__tests__/helpers/adaptor';

jest.mock('../../components/subtree', () => ({
  useSubtree: true,
  subtreeMaxDepthFromConfig: 5,
}));

beforeAll(() => {
  // @ts-expect-error
  process.env.GOJI_WRAPPED_COMPONENTS = [];
});
const view = () => new ElementInstance('view', {}, [], new Container(new TestingAdaptorInstance()));
const subtree = () =>
  new ElementInstance(TYPE_SUBTREE, {}, [], new Container(new TestingAdaptorInstance()));
/**
 * linkElements
 * call `setParent` and `children.push` for given elements
 * [a, b, c] => a <- b <- c
 */
const linkElements = (elements: Array<ElementInstance>) => {
  const mockContainer = new Container(new TestingAdaptorInstance());
  const mockRoot = new ElementInstance(GOJI_VIRTUAL_ROOT, {}, [], mockContainer);
  elements[0].setParent(mockRoot);
  for (let i = 0; i < elements.length - 1; i += 1) {
    elements[i].appendChild(elements[i + 1]);
  }
};

describe('use subtree', () => {
  test('container works', () => {
    let leaf: ElementInstance;
    const elements = [view(), view(), (leaf = view())];
    linkElements(elements);
    expect(leaf.getSubtreeId()).toBe(undefined);
  });

  test('auto subtree works', () => {
    let leaf: ElementInstance;
    let sub: ElementInstance;
    const elements = [view(), view(), view(), view(), (sub = view()), view(), (leaf = view())];
    linkElements(elements);
    expect(leaf.getSubtreeId()).toBe(sub.id);
  });

  test('manual subtree works', () => {
    let leaf: ElementInstance;
    let sub: ElementInstance;
    const elements = [view(), view(), (sub = subtree()), view(), (leaf = view())];
    linkElements(elements);
    expect(leaf.getSubtreeId()).toBe(sub.id);
  });

  test('auto subtree inside manual subtree works', () => {
    let leaf: ElementInstance;
    let sub: ElementInstance;
    const elements = [
      view(),
      view(),
      subtree(),
      view(),
      view(),
      view(),
      view(),
      (sub = view()),
      view(),
      (leaf = view()),
    ];
    linkElements(elements);
    expect(leaf.getSubtreeId()).toBe(sub.id);
  });
});
