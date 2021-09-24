import React, { useEffect, useReducer } from 'react';
import { View } from '../..';
import { act } from '../../testUtils';
import { createEventProxy, useEventProxy } from '../eventProxy';
import { render } from '../../__tests__/helpers';
import { ContainerProvider } from '../container';

describe('eventProxy', () => {
  test('batched', () => {
    let renderCount = 0;
    const eventProxy = createEventProxy();

    const App = () => {
      const [, forceRender] = useReducer(s => s + 1, 0);
      const eventProxyContext = useEventProxy();

      useEffect(
        () =>
          eventProxyContext.lifecycleChannel.onLoad.on(() => {
            forceRender();
            forceRender();
          }),
        [eventProxyContext],
      );
      renderCount += 1;
      return <View />;
    };

    act(() => {
      render(
        <ContainerProvider container={{ eventProxy } as any}>
          <App />
        </ContainerProvider>,
      );
    });
    expect(renderCount).toBe(1);

    // should batch updates
    eventProxy.lifecycleChannel.onLoad.emit({});
    act(() => {});
    expect(renderCount).toBe(2);
  });
});
