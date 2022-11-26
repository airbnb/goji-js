import React, { useState, createRef } from 'react';
import { ElementInstance, ElementNodeDevelopment, TextNodeDevelopment } from '../instance';
import { Container } from '../../container';
import { View, gojiEvents } from '../..';
import { act } from '../../testUtils';
import { batchedUpdates } from '..';
import { PublicInstance } from '../publicInstance';
import { render } from '../../__tests__/helpers';
import { TestingAdaptorInstance } from '../../__tests__/helpers/adaptor';

describe('ElementInstance', () => {
  beforeAll(() => {
    // @ts-expect-error
    process.env.GOJI_WRAPPED_COMPONENTS = [];
  });

  const instance = new ElementInstance(
    'view',
    {
      className: 'wrapper',
      children: ['string'],
      onClick: () => {},
    },
    [],
    new Container(new TestingAdaptorInstance()),
  );

  test('init works', () => {
    expect(instance.type).toBe('view');
    expect(instance.props.children).toBeUndefined();
  });

  test('pure works', () => {
    const [pured] = instance.pure('');
    expect((pured as ElementNodeDevelopment).props.className).toBe('wrapper');
    expect((pured as ElementNodeDevelopment).props.onClick).toBeUndefined();
  });

  test('simplify works', () => {
    const simpleInstance = new ElementInstance(
      'view',
      {
        className: 'wrapper',
      },
      [],
      new Container(new TestingAdaptorInstance()),
    );
    const [pured] = simpleInstance.pure('');
    expect((pured as ElementNodeDevelopment).simplifiedId).not.toBeUndefined();
  });

  test('batched event handler', () => {
    let callback: () => void;
    let renderCount = 0;
    const viewRef = createRef<PublicInstance>();

    const App = () => {
      renderCount += 1;
      const [a, setA] = useState(0);
      const [b, setB] = useState(0);
      callback = () => {
        setA(a + 1);
        setB(b + 1);
      };

      return (
        <View onTap={callback} ref={viewRef}>
          count is {a + b}
        </View>
      );
    };

    act(() => {
      render(<App />);
    });
    expect(renderCount).toBe(1);

    // non batched
    // @ts-expect-error
    callback();
    act(() => {});
    expect(renderCount).toBe(3);

    // batched
    // @ts-expect-error
    batchedUpdates(callback);
    act(() => {});
    expect(renderCount).toBe(4);

    // event handler
    // trigger onTap manually
    gojiEvents.triggerEvent({
      type: 'tap',
      timeStamp: 1,
      currentTarget: {
        dataset: {
          gojiId: viewRef.current!.unsafe_gojiId,
        },
      },
      target: {
        dataset: {
          gojiId: viewRef.current!.unsafe_gojiId,
        },
      },
    });
    act(() => {});
    expect(renderCount).toBe(5);
  });

  test('appendChild and insertBefore should remove existing child before adding', () => {
    let setItemsCallback: (items: Array<number>) => void;
    const App = () => {
      const [items, setItems] = useState<Array<number>>([1, 2, 3]);
      setItemsCallback = setItems;

      return (
        <View>
          {items.map(item => (
            <View key={item}>{item}</View>
          ))}
        </View>
      );
    };

    const { getContainer } = render(<App />);
    const getTextList = () => {
      // FIXME: will implement better debug API for RenderResult
      const viewNodes = (
        (getContainer() as { meta: ElementNodeDevelopment }).meta
          .children[0] as ElementNodeDevelopment
      ).children;
      const textNodes = viewNodes.map(view => (view as ElementNodeDevelopment).children[0]);
      return textNodes.map(text => (text as TextNodeDevelopment).text);
    };
    expect(getTextList()).toEqual(['1', '2', '3']);
    act(() => {
      setItemsCallback([2, 1, 3]);
    });
    expect(getTextList()).toEqual(['2', '1', '3']);
  });

  test('appendChild and insertBefore should remove existing child before adding ( for Container )', () => {
    let setItemsCallback: (items: Array<number>) => void;
    const App = () => {
      const [items, setItems] = useState<Array<number>>([1, 2, 3]);
      setItemsCallback = setItems;

      return (
        <>
          {items.map(item => (
            <View key={item}>{item}</View>
          ))}
        </>
      );
    };

    const { getContainer } = render(<App />);
    const getTextList = () => {
      // FIXME: will implement better debug API for RenderResult
      const viewNodes = (getContainer() as { meta: ElementNodeDevelopment }).meta.children;
      const textNodes = viewNodes.map(view => (view as ElementNodeDevelopment).children[0]);
      return textNodes.map(text => (text as TextNodeDevelopment).text);
    };
    expect(getTextList()).toEqual(['1', '2', '3']);
    // @ts-expect-error
    setItemsCallback([2, 1, 3]);
    expect(getTextList()).toEqual(['2', '1', '3']);
  });
});
