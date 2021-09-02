import { CachedEventChannel, EventChannel } from '../eventChannel';

describe('EventChannel', () => {
  test('on and emit', () => {
    const channel = new EventChannel<{ first: string; last: string }, string>();
    const listener1 = jest
      .fn()
      .mockImplementation(
        ({ first, last }: { first: string; last: string }) => `1 ${first} ${last}`,
      );
    const listener2 = jest
      .fn()
      .mockImplementation(
        ({ first, last }: { first: string; last: string }) => `2 ${first} ${last}`,
      );
    const listener3 = jest
      .fn()
      .mockImplementation(
        ({ first, last }: { first: string; last: string }) => `3 ${first} ${last}`,
      );
    channel.on(listener1);
    channel.on(listener2);
    channel.on(listener3);
    expect(channel.listenerCount()).toBe(3);
    expect(channel.emit({ first: 'hello', last: 'world' })).toEqual([
      '1 hello world',
      '2 hello world',
      '3 hello world',
    ]);
    expect(channel.emit({ first: 'hello', last: 'react' })).toEqual([
      '1 hello react',
      '2 hello react',
      '3 hello react',
    ]);
    expect(channel.emit({ first: 'hello', last: 'goji' })).toEqual([
      '1 hello goji',
      '2 hello goji',
      '3 hello goji',
    ]);
    expect(listener1).toBeCalledTimes(3);
    expect(listener2).toBeCalledTimes(3);
    expect(listener3).toBeCalledTimes(3);
  });

  test('once and emit', () => {
    const channel = new EventChannel<{ first: string; last: string }, string>();
    const listener1 = jest
      .fn()
      .mockImplementation(
        ({ first, last }: { first: string; last: string }) => `1 ${first} ${last}`,
      );
    const listener2 = jest
      .fn()
      .mockImplementation(
        ({ first, last }: { first: string; last: string }) => `2 ${first} ${last}`,
      );
    const listener3 = jest
      .fn()
      .mockImplementation(
        ({ first, last }: { first: string; last: string }) => `3 ${first} ${last}`,
      );
    channel.once(listener1);
    channel.once(listener2);
    channel.once(listener3);
    expect(channel.listenerCount()).toBe(3);
    expect(channel.emit({ first: 'hello', last: 'world' })).toEqual([
      '1 hello world',
      '2 hello world',
      '3 hello world',
    ]);
    expect(channel.listenerCount()).toBe(0);
    expect(channel.emit({ first: 'hello', last: 'react' })).toEqual([]);
    expect(channel.emit({ first: 'hello', last: 'goji' })).toEqual([]);
    expect(listener1).toBeCalledTimes(1);
    expect(listener2).toBeCalledTimes(1);
    expect(listener3).toBeCalledTimes(1);
  });

  test('filteredOnce and emit', () => {
    const channel = new EventChannel<{ first: string; last: string }, string>();
    const listener1 = jest.fn();
    channel.filteredOnce(data => data.last === 'goji', listener1);

    channel.emit({ first: 'hello', last: 'world' });
    expect(listener1).toBeCalledTimes(0);
    expect(channel.listenerCount()).toBe(1);

    channel.emit({ first: 'hello', last: 'goji' });
    expect(listener1).toBeCalledTimes(1);
    expect(channel.listenerCount()).toBe(0);

    channel.emit({ first: 'hello', last: 'react' });
    expect(listener1).toBeCalledTimes(1);
    expect(channel.listenerCount()).toBe(0);
  });

  describe('off and offAll', () => {
    const channel = new EventChannel();
    const listener1 = jest.fn();
    const listener2 = jest.fn();
    const listener3 = jest.fn();
    channel.on(listener1);
    const off2 = channel.on(listener2);
    channel.on(listener3);

    beforeEach(() => {
      listener1.mockClear();
      listener2.mockClear();
      listener3.mockClear();
    });

    test('not match', () => {
      channel.off(() => {});
      channel.emit();
      expect(listener1).toBeCalledTimes(1);
    });

    test('off listener', () => {
      channel.off(listener1);
      channel.emit();
      expect(listener1).not.toBeCalled();
    });

    test(`off by on's clean-up function`, () => {
      off2();
      channel.emit();
      expect(listener2).not.toBeCalled();
    });

    test(`off by once's clean-up function`, () => {
      const listener = jest.fn();
      const off = channel.once(listener);
      off();
      channel.emit();
      expect(listener).not.toBeCalled();
    });

    test('offAll', () => {
      channel.offAll();
      channel.emit();
      expect(listener1).not.toBeCalled();
    });
  });

  test('off while emitting', () => {
    const channel = new EventChannel();
    const listener2 = jest.fn();
    const listener1 = jest.fn().mockImplementation(() => {
      channel.off(listener2);
    });
    const listener3 = jest.fn().mockImplementation(() => {
      channel.offAll();
    });
    const listener4 = jest.fn();
    channel.on(listener1);
    channel.on(listener2);
    channel.on(listener3);
    channel.on(listener4);
    channel.emit();
    expect(listener1).toBeCalledTimes(1);
    expect(listener2).toBeCalledTimes(0);
    expect(listener3).toBeCalledTimes(1);
    expect(listener4).toBeCalledTimes(0);
  });
});

describe('CachedEventChannel', () => {
  test('on with cache', () => {
    const channel = new CachedEventChannel<string>();
    channel.emit('a');
    const listener1 = jest.fn();
    channel.on(listener1);
    expect(listener1).toBeCalledTimes(1);
    expect(listener1).toBeCalledWith('a');
    channel.emit('b');
    expect(listener1).toBeCalledTimes(2);
    expect(listener1).toBeCalledWith('b');
  });

  test('once with cache', () => {
    const channel = new CachedEventChannel<string>();
    channel.emit('a');
    const listener1 = jest.fn();
    channel.once(listener1);
    expect(listener1).toBeCalledTimes(1);
    expect(listener1).toBeCalledWith('a');
    channel.emit('b');
    expect(listener1).toBeCalledTimes(1);
  });

  test('filteredOnce with cache', () => {
    const channel = new CachedEventChannel<string>();
    channel.emit('a');
    const listener1 = jest.fn();
    channel.filteredOnce(data => data === 'a', listener1);
    expect(listener1).toBeCalledTimes(1);
    expect(listener1).toBeCalledWith('a');
    channel.emit('b');
    expect(listener1).toBeCalledTimes(1);
  });

  test('on without cache', () => {
    const channel = new CachedEventChannel<string>();
    const listener1 = jest.fn();
    channel.on(listener1);
    expect(listener1).toBeCalledTimes(0);
    channel.emit('a');
    expect(listener1).toBeCalledTimes(1);
    expect(listener1).toBeCalledWith('a');
    expect(channel.listenerCount()).toBe(1);
  });

  test('once without cache', () => {
    const channel = new CachedEventChannel<string>();
    const listener1 = jest.fn();
    channel.once(listener1);
    expect(listener1).toBeCalledTimes(0);
    channel.emit('a');
    expect(listener1).toBeCalledTimes(1);
    expect(listener1).toBeCalledWith('a');
    channel.emit('b');
    expect(listener1).toBeCalledTimes(1);
    expect(channel.listenerCount()).toBe(0);
  });

  test('filteredOnce without cache', () => {
    const channel = new CachedEventChannel<string>();
    const listener1 = jest.fn();
    channel.filteredOnce(data => data === 'b', listener1);
    expect(listener1).toBeCalledTimes(0);
    channel.emit('a');
    expect(listener1).toBeCalledTimes(0);
    channel.emit('b');
    expect(listener1).toBeCalledTimes(1);
    expect(listener1).toBeCalledWith('b');
    expect(channel.listenerCount()).toBe(0);
  });
});
