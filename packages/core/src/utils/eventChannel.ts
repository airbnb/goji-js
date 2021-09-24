// `[T] extends [undefined]` is used to support union type in T
// For more details see:
// https://stackoverflow.com/questions/61926729/why-does-a-typescript-type-conditional-on-t-extends-undefined-with-t-instanti
// https://github.com/microsoft/TypeScript/issues/37279#issuecomment-596192183
type Callback<T, R> = [T] extends [undefined] ? (data?: T) => R : (data: T) => R;

type TaskResult<R> = { success: false } | { success: true; result: R };

class EventChannelTask<T = undefined, R = void> {
  public constructor(
    public taskCallback: (this: EventChannelTask<T, R>, data: T) => TaskResult<R>,
    public originalCallback: Callback<T, R>,
    public ttl: number,
  ) {}
}

let batchedRun: <R>(callback: () => R) => R = callback => callback();

export const setBatchedUpdates = (batchedUpdates: <R>(callback: () => R) => R) => {
  batchedRun = batchedUpdates;
};

/**
 * `EventChannel` is a pub-sub event hub implementation.
 * It's mainly inspired from built-in `events` library but also provides several important new features.
 * 1. `EventChannel` is type-safed.
 * 2. No `event name`, use data payload instead.
 * 3. `EventChannel` provides a duplexed channel from both pub-to-sub and sub-to-pub by returning
 * a value from listener callback. See example bellow.
 * @example
 * const channel = new EventChannel<string, string>;
 * channel.on(msg => msg.toUpperCase());
 * channel.on(msg => msg.toLowerCase());
 * channel.emit('Hello'); // returns ['HELLO', 'hello']
 */
export class EventChannel<T = undefined, R = void> {
  // protected interfaces

  protected tasks: Array<EventChannelTask<T, R>> = [];

  protected enqueueTask(callback: Callback<T, R>, times: number, filter: Callback<T, boolean>) {
    const channel = this;
    const task = new EventChannelTask<T, R>(
      function taskCallback(data) {
        if (this.ttl <= 0) {
          channel.off(this.originalCallback);
          return { success: false };
        }
        if (filter(data)) {
          this.ttl -= 1;
          if (this.ttl <= 0) {
            channel.off(this.originalCallback);
          }
          return { success: true, result: batchedRun(() => callback(data)) };
        }

        return { success: false };
      },
      callback,
      times,
    );
    this.tasks.push(task);

    return () => this.off(callback);
  }

  protected emitTask(data: T): Array<R> {
    return batchedRun(() => {
      const results: Array<R> = [];
      // cache the listeners in case of being modified during emitting
      const forkedTasks = [...this.tasks];
      for (let index = 0; index < forkedTasks.length; index += 1) {
        const task = forkedTasks[index];
        const result = task.taskCallback(data);
        if (result.success) {
          results.push(result.result);
        }
      }
      return results;
    });
  }

  // public interfaces

  public on(callback: Callback<T, R>) {
    return this.enqueueTask(callback, Infinity, () => true);
  }

  public once(callback: Callback<T, R>) {
    return this.enqueueTask(callback, 1, () => true);
  }

  /**
   * use `match` to filter events and run `callback` only once if matched
   */
  public filteredOnce(filter: Callback<T, boolean>, callback: Callback<T, R>) {
    return this.enqueueTask(callback, 1, filter);
  }

  public emit: Callback<T, Array<R>> = data => this.emitTask(data);

  public off(callback: Callback<T, R>) {
    const pos = this.tasks.findIndex(listener => listener.originalCallback === callback);
    if (pos !== -1) {
      // set `ttl` to 0 to prevent unexpected call from cached closure
      this.tasks[pos].ttl = 0;
      this.tasks.splice(pos, 1);
    }
  }

  public offAll() {
    for (const task of this.tasks) {
      // set `ttl` to 0 to prevent unexpected call from cached closure
      task.ttl = 0;
    }
    this.tasks = [];
  }

  public listenerCount() {
    return this.tasks.length;
  }
}

export class CachedEventChannel<T = undefined, R = void> extends EventChannel<T, R> {
  public constructor() {
    super();
  }

  private isCached = false;

  private cachedData?: T;

  public override emit: Callback<T, Array<R>> = data => {
    this.isCached = true;
    this.cachedData = data;

    return this.emitTask(data);
  };

  public override on(callback: Callback<T, R>) {
    const cancel = super.on(callback);
    if (this.isCached) {
      batchedRun(() => callback(this.cachedData!));
    }

    return cancel;
  }

  public override once(callback: Callback<T, R>) {
    const cancel = super.once(callback);
    if (this.isCached) {
      batchedRun(() => callback(this.cachedData!));
      // cancel the task immediately
      cancel();
    }

    return cancel;
  }

  public override filteredOnce(filter: Callback<T, boolean>, callback: Callback<T, R>) {
    const cancel = super.filteredOnce(filter, callback);
    if (this.isCached && filter(this.cachedData!)) {
      batchedRun(() => callback(this.cachedData!));
      // cancel the task immediately
      cancel();
    }

    return cancel;
  }
}
