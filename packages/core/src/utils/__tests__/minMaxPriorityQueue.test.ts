import { MinMaxPriorityQueue } from '../minMaxPriorityQueue';

describe('MinMaxPriorityQueue', () => {
  const buildQueue = () => {
    const queue = new MinMaxPriorityQueue<number>();
    for (const item of [5, 3, 4, 1, 2]) {
      queue.insert(item, item);
    }
    return queue;
  };

  test('popMax works', () => {
    const queue = buildQueue();
    expect(queue.popMax()).toBe(5);
    expect(queue.popMax()).toBe(4);
    expect(queue.popMax()).toBe(3);
    expect(queue.popMax()).toBe(2);
    expect(queue.popMax()).toBe(1);
    expect(() => queue.popMax()).toThrow();
  });

  test('popMin works', () => {
    const queue = buildQueue();
    expect(queue.popMin()).toBe(1);
    expect(queue.popMin()).toBe(2);
    expect(queue.popMin()).toBe(3);
    expect(queue.popMin()).toBe(4);
    expect(queue.popMin()).toBe(5);
    expect(() => queue.popMin()).toThrow();
  });

  test('peekMax works', () => {
    const queue = buildQueue();
    expect(queue.peekMax()).toBe(5);
    expect(queue.popMax()).toBe(5);
    expect(queue.peekMax()).toBe(4);
    expect(queue.popMax()).toBe(4);
  });

  test('peekMin works', () => {
    const queue = buildQueue();
    expect(queue.peekMin()).toBe(1);
    expect(queue.popMin()).toBe(1);
    expect(queue.peekMin()).toBe(2);
    expect(queue.popMin()).toBe(2);
  });

  test('popMin and popMax works', () => {
    const queue = buildQueue();
    expect(queue.popMax()).toBe(5);
    expect(queue.popMin()).toBe(1);
    expect(queue.popMax()).toBe(4);
    expect(queue.popMin()).toBe(2);
    expect(queue.peekMax()).toBe(3);
    expect(queue.peekMin()).toBe(3);
  });

  test('works for other types', () => {
    const queue = new MinMaxPriorityQueue<any>();
    const a = { a: 1 };
    const b = { b: 1 };
    const c = { c: 1 };
    queue.insert(3, c);
    queue.insert(1, a);
    queue.insert(2, b);

    expect(queue.popMax()).toBe(c);
    expect(queue.popMin()).toBe(a);
  });

  test('throw if duplicated priorities', () => {
    const queue = buildQueue();
    expect(() => queue.insert(3, 3)).toThrow();
  });
});
