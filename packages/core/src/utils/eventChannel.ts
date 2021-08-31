type Callback<T, R> = T extends undefined ? (data?: T) => R : (data: T) => R;

type TaskResult<R> = { success: false } | { success: true; result: R };

class EventChannelTask<T = undefined, R = void> {
  public constructor(
    public taskCallback: (this: EventChannelTask<T, R>, data: T) => TaskResult<R>,
    public originalCallback: Callback<T, R>,
    public ttl: number,
  ) {}
}

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
  private tasks: Array<EventChannelTask<T, R>> = [];

  private enqueueTask(callback: Callback<T, R>, times: number, filter: Callback<T, boolean>) {
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
          return { success: true, result: callback(data) };
        }

        return { success: false };
      },
      callback,
      times,
    );
    this.tasks.push(task);

    return () => this.off(callback);
  }

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

  public emit: Callback<T, Array<R>> = data => {
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
  };

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
