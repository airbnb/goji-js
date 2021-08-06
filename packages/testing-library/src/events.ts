import { ReactTestInstance, act } from 'react-test-renderer';
import { validComponentFilter } from './utils/queryHelpers';

const buildTargetInfo = (node: ReactTestInstance) => ({ offsetLeft: 0, offsetTop: 0, id: node.props.id, dataset: {} });

const fireEventOnInstance = ({
  node,
  type,
  eventName,
  detail = {},
  bubble = false,
}: {
  node: ReactTestInstance;
  type: string;
  eventName: string;
  detail?: Record<string, any>;
  bubble?: boolean;
}) => {
  act(() => {
    let stoppedPropagation = false;
    const stopPropagation = () => {
      stoppedPropagation = true;
    };
    const eventPayload = { type, detail, target: buildTargetInfo(node), stopPropagation };
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
      detail: { x: 0, y: 0 },
      bubble: true,
    });
  }

  public static input(node: ReactTestInstance, value: string) {
    fireEventOnInstance({
      node,
      type: 'input',
      eventName: 'onInput',
      detail: { cursor: 0, keyCode: 0, value },
      bubble: false,
    });
  }

  public static confirm(node: ReactTestInstance) {
    fireEventOnInstance({
      node,
      type: 'confirm',
      eventName: 'onConfirm',
      detail: { value: node.props.value },
      bubble: false,
    });
  }
}

export { FireEvent as fireEvent };
