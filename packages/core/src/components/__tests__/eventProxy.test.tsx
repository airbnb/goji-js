import React, { createRef, useEffect, useReducer } from 'react';
import { View } from '../..';
import { act } from '../../testUtils';
import { EventProxyProvider, useEventProxy } from '../eventProxy';
import { render } from '../../__tests__/helpers';
import { ContainerProvider } from '../container';

describe('eventProxy', () => {
  test('batched', () => {
    let renderCount = 0;
    const eventProxyRef = createRef<{ emitEvent(name: string, data?: any): void }>();

    const App = () => {
      const [, forceRender] = useReducer(s => s + 1, 0);
      const eventProxyContext = useEventProxy();

      useEffect(() => {
        return eventProxyContext.handleEvent('test', () => {
          forceRender();
          forceRender();
        });
      }, [eventProxyContext]);
      renderCount += 1;
      return <View />;
    };

    act(() => {
      render(
        <ContainerProvider container={{ eventProxyRef } as any}>
          <EventProxyProvider>
            <App />
          </EventProxyProvider>
        </ContainerProvider>,
      );
    });
    expect(renderCount).toBe(1);

    // unknown event
    eventProxyRef.current!.emitEvent('unknown');
    act(() => {});
    expect(renderCount).toBe(1);

    // should batch updates
    eventProxyRef.current!.emitEvent('test');
    act(() => {});
    expect(renderCount).toBe(2);
  });
});
