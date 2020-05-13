import { ReactTestInstance, act } from 'react-test-renderer';
import { validComponentFilter } from './utils/queryHelpers';

const buildTargetInfo = (node: ReactTestInstance) => {
  return { offsetLeft: 0, offsetTop: 0, id: node.props.id, dataset: {} };
};

const fireEventOnInstance = ({
  node,
  type,
  eventName,
  details = {},
  bubble = false,
}: {
  node: ReactTestInstance;
  type: string;
  eventName: string;
  details?: Record<string, any>;
  bubble?: boolean;
}) => {
  act(() => {
    let stoppedPropagation = false;
    const stopPropagation = () => {
      stoppedPropagation = true;
    };
    const eventPayload = { type, details, target: buildTargetInfo(node), stopPropagation };
    const eventHandler = node.props[eventName];
    if (typeof eventHandler === 'function') {
      eventHandler({ ...eventPayload, currentTarget: buildTargetInfo(node) });
    }
    if (bubble) {
      let targetNode = node.parent;
      while (targetNode && !stoppedPropagation) {
        if (validComponentFilter(targetNode)) {
          const targetEventHandler = targetNode.props[eventName];
          if (typeof targetEventHandler === 'function') {
            targetEventHandler({ ...eventPayload, currentTarget: buildTargetInfo(node) });
          }
        }

        targetNode = targetNode.parent;
      }
    }
  });
};

class FireEvent {
  public static tap(node: ReactTestInstance) {
    fireEventOnInstance({
      node,
      type: 'tap',
      eventName: 'onTap',
      details: { x: 0, y: 0 },
      bubble: true,
    });
  }

  public static input(node: ReactTestInstance, value: string) {
    fireEventOnInstance({
      node,
      type: 'input',
      eventName: 'onInput',
      details: { cursor: 0, keyCode: 0, value },
      bubble: true,
    });
  }
}

export { FireEvent as fireEvent };
