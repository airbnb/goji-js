interface LinkedNode<T> {
  next?: LinkedNode<T>;
  prev?: LinkedNode<T>;
  data: T;
}

function createGuardNode<T>(): LinkedNode<T> {
  return { data: Symbol('guard node') as any };
}

/* eslint-disable no-param-reassign */
class LinkedList<T> {
  private guardNode = createGuardNode<T>();

  private head: LinkedNode<T> = this.guardNode;

  private tail: LinkedNode<T> = this.guardNode;

  public isEmpty(): boolean {
    // list is empty if there was only a guard node inside it
    return this.head === this.tail;
  }

  public getHead(): LinkedNode<T> {
    if (process.env.NODE_ENV !== 'production') {
      if (this.isEmpty()) {
        throw new Error('LinkedList: cannot read from an empty linked list');
      }
    }
    // ignore guard node
    const node = this.head.next;

    return node!;
  }

  public getTail(): LinkedNode<T> {
    if (process.env.NODE_ENV !== 'production') {
      if (this.isEmpty()) {
        throw new Error('LinkedList: cannot read from an empty linked list');
      }
    }
    return this.tail;
  }

  /**
   * create a new node from `data` and insert after `position`
   * if `position` is `undefined` then the new node will be insert at head
   * @param position
   * @param data
   */
  public insertAfter(position: LinkedNode<T> = this.guardNode, data: T) {
    const newNode: LinkedNode<T> = { data, prev: position, next: position.next };
    if (this.tail === position) {
      this.tail = newNode;
    }
    if (newNode.prev) {
      newNode.prev.next = newNode;
    }
    if (newNode.next) {
      newNode.next.prev = newNode;
    }
  }

  /**
   * find by `condition` check from tail to head
   * @param condition
   */
  public findLast(condition: (node: T) => boolean): LinkedNode<T> | undefined {
    let current: LinkedNode<T> | undefined = this.tail;
    while (current && current !== this.guardNode) {
      if (condition(current.data)) {
        return current;
      }
      current = current.prev;
    }
    return undefined;
  }

  public remove(node: LinkedNode<T>) {
    if (this.tail === node) {
      this.tail = node.prev!;
    }
    if (node.prev) {
      node.prev.next = node.next;
    }
    if (node.next) {
      node.next.prev = node.prev;
    }
  }
}
/* eslint-enable no-param-reassign */

/**
 * The `MinMaxPriorityQueue` implements a sorted list with incremental priorities
 * This data structure is designed and optimized for these use cases
 * 1. input priorities are approximate incremental
 * 2. always read the max/min value from list
 * Meeting above restrictions the insert/remove/read algorithm complexity could become O(1)
 * @example
 * const list = new MinMaxPriorityQueue<string>();
 * list.insert(1, 'a');
 * list.insert(2, 'b');
 * list.insert(3, 'c');
 * console.log(list.peekMin()); // return 'a' list: ['a', 'b', 'c']
 * console.log(list.peekMax()); // return 'c' list: ['a', 'b', 'c']
 * console.log(list.popMax()); // return: 'c' list: ['a', 'b']
 * console.log(list.popMin()); // return 'a' list: ['b']
 * @see
 * https://en.wikipedia.org/wiki/Double-ended_priority_queue
 */
export class MinMaxPriorityQueue<T> {
  private list = new LinkedList<number>();

  private dataMap = new Map<number, T>();

  public insert(priority: number, data: T) {
    const { list } = this;
    const node = list.findLast(current => current < priority);
    if (process.env.NODE_ENV !== 'production') {
      if (node?.next?.data === priority) {
        throw new Error('MinMaxPriorityQueue: cannot insert duplicated priorities');
      }
    }
    list.insertAfter(node, priority);
    this.dataMap.set(priority, data);
  }

  private read(fromHead: boolean, shouldRemove: boolean): T {
    const node = fromHead ? this.list.getHead() : this.list.getTail();
    const data = this.dataMap.get(node.data);
    // remove after read
    if (shouldRemove) {
      this.list.remove(node);
      this.dataMap.delete(node.data);
    }
    return data!;
  }

  public popMax() {
    return this.read(false, true);
  }

  public popMin() {
    return this.read(true, true);
  }

  public peekMax() {
    return this.read(false, false);
  }

  public peekMin() {
    return this.read(true, false);
  }
}
