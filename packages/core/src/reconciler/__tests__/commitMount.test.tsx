import React, { useEffect, useState } from 'react';
import { View } from '../../components/factoryComponents';
import { gojiEvents } from '../../events';
import { render, RenderResult } from '../../__tests__/helpers';
import { act } from '../../testUtils';

jest.useFakeTimers();

jest.mock('../../events', () => ({
  gojiEvents: {
    registerEventHandler: jest.fn(),
    unregisterEventHandler: jest.fn(),
  },
}));

class ErrorBoundary extends React.Component {
  public constructor(props) {
    super(props);
  }

  public override state = { hasError: false };

  public static getDerivedStateFromError() {
    return { hasError: true };
  }

  public override render() {
    const { hasError } = this.state;
    if (hasError) {
      setTimeout(() => {
        this.setState({ hasError: false });
      }, 3000);
      // You can render any custom fallback UI
      return 'fallback';
    }

    const { children } = this.props;
    return children;
  }
}

let shouldThrow = true;

const Broken = () => {
  if (shouldThrow) {
    shouldThrow = false;
    throw new Error('broken error');
  }

  return null;
};

const App = () => {
  const [show, setShow] = useState(true);
  useEffect(() => {
    setTimeout(() => {
      setShow(false);
    }, 6000);
  }, []);

  if (!show) {
    return null;
  }

  return (
    <ErrorBoundary>
      <View>test</View>
      <Broken />
    </ErrorBoundary>
  );
};

const renderApp = (): RenderResult => {
  let wrapper: RenderResult;
  act(() => {
    wrapper = render(<App />);
  });

  // @ts-expect-error
  return wrapper;
};

test('works with ErrorBoundary', () => {
  // init
  expect(gojiEvents.registerEventHandler).toBeCalledTimes(0);
  expect(gojiEvents.unregisterEventHandler).toBeCalledTimes(0);

  // first rendering, ErrorBoundary should show
  const wrapper = renderApp();
  expect(wrapper.getContainer()).toMatchSnapshot('ErrorBoundary fallback');
  expect(gojiEvents.registerEventHandler).toBeCalledTimes(0); // `<View>test</View>` should not register event handler
  expect(gojiEvents.unregisterEventHandler).toBeCalledTimes(0);

  // second rendering, ErrorBoundary should hide after 3s
  jest.advanceTimersByTime(3000);
  expect(wrapper.getContainer()).toMatchSnapshot('test view showing');
  expect(gojiEvents.registerEventHandler).toBeCalledTimes(1); // `<View>test</View>` should register event handler
  expect(gojiEvents.unregisterEventHandler).toBeCalledTimes(0);

  // third rendering, all components should be unmounted after 6s
  jest.advanceTimersByTime(6000);
  expect(wrapper.getContainer()).toMatchSnapshot('all components unmount');
  expect(gojiEvents.registerEventHandler).toBeCalledTimes(1);
  expect(gojiEvents.unregisterEventHandler).toBeCalledTimes(1); // `<View>test</View>` should unregister event handler
  // id should same
  expect(jest.mocked(gojiEvents.registerEventHandler).mock.calls[0][0]).toBe(
    jest.mocked(gojiEvents.unregisterEventHandler).mock.calls[0][0],
  );

  // all timer done
  expect(jest.getTimerCount()).toBe(0);
});
