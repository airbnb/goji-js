import React, { createRef } from 'react';
import { renderHook } from '@testing-library/react-hooks';
import { useRenderedEffect } from '../renderedEffect';
import { ContainerProvider } from '../../../components/container';
import { EventProxy, EventProxyProvider } from '../../../components/eventProxy';

describe('useRenderedEffect', () => {
  test('callback works', () => {
    const renderId = 0;
    // TODO: find a better way to mock container
    const container = {
      eventProxyRef: createRef<EventProxy>(),
      getRenderId() {
        return renderId;
      },
    };
    const callback = jest.fn() as jest.Mock<undefined, [string]>;
    const useTest = () => {
      useRenderedEffect(() => {
        callback('rendered effect');
      });
    };
    const wrapper = ({ children }) => (
      <ContainerProvider container={container as any}>
        <EventProxyProvider>{children}</EventProxyProvider>
      </ContainerProvider>
    );
    const { result } = renderHook(useTest, { wrapper });
    expect(result.error).toBeFalsy();

    expect(callback.mock.calls).toEqual([]);
    container.eventProxyRef.current?.emitEvent('internalRendered', renderId);
    expect(callback.mock.calls).toEqual([['rendered effect']]);
  });

  test('clean-up works', () => {
    let renderId = 0;
    // TODO: find a better way to mock container
    const container = {
      eventProxyRef: createRef<EventProxy>(),
      getRenderId: () => renderId,
    };
    const callback = jest.fn() as jest.Mock<undefined, [string]>;
    const useTest = ({ count }: { count: number }) => {
      useRenderedEffect(() => {
        callback(`rendered effect ${count}`);

        return () => callback(`rendered effect callback ${count}`);
      });
    };
    const wrapper = ({ children }: React.PropsWithChildren<{ count: number }>) => (
      <ContainerProvider container={container as any}>
        <EventProxyProvider>{children}</EventProxyProvider>
      </ContainerProvider>
    );
    const { result, rerender, unmount } = renderHook(useTest, {
      wrapper,
      initialProps: { count: 0 },
    });

    renderId = 1;
    rerender({ count: 1 });

    renderId = 2;
    rerender({ count: 2 });

    // renderId=2 and renderId=3 are merged
    rerender({ count: 3 });

    expect(result.error).toBeFalsy();

    expect(callback.mock.calls).toEqual([]);

    container.eventProxyRef.current?.emitEvent('internalRendered', 0);
    expect(callback.mock.calls).toEqual([['rendered effect 0']]);

    container.eventProxyRef.current?.emitEvent('internalRendered', 1);
    expect(callback.mock.calls).toEqual([
      ['rendered effect 0'],
      ['rendered effect callback 0'],
      ['rendered effect 1'],
    ]);

    container.eventProxyRef.current?.emitEvent('internalRendered', 2);
    expect(callback.mock.calls).toEqual([
      ['rendered effect 0'],
      ['rendered effect callback 0'],
      ['rendered effect 1'],
      ['rendered effect callback 1'],
      ['rendered effect 2'],
      ['rendered effect callback 2'],
      ['rendered effect 3'],
    ]);

    unmount();
    expect(callback.mock.calls).toEqual([
      ['rendered effect 0'],
      ['rendered effect callback 0'],
      ['rendered effect 1'],
      ['rendered effect callback 1'],
      ['rendered effect 2'],
      ['rendered effect callback 2'],
      ['rendered effect 3'],
      ['rendered effect callback 3'],
    ]);
  });
});
