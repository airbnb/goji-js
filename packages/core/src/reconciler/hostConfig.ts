import { Container } from '../container';
import { InstanceProps, ElementInstance, TextInstance } from './instance';
import { PublicInstance, subtreeInstances } from './publicInstance';
import events from '../subtreeAttachEvents';
import { GojiHostConfig } from './hostConfigTypes';

type SuspenseInstance = any;
type HydratableInstance = any;
type HostContext = any;
type UpdatePayload = boolean;
type ChildSet = any;
type TimeoutHandle = any;
type NoTimeout = number;

const startDate = Date.now();

// docs: https://github.com/facebook/react/blob/d483463bc86555decb3e8caa18459d1d0f7c0148/packages/react-reconciler/README.md
export const hostConfig: GojiHostConfig<
  string,
  InstanceProps,
  Container,
  ElementInstance,
  TextInstance,
  SuspenseInstance,
  HydratableInstance,
  PublicInstance | undefined,
  HostContext,
  UpdatePayload,
  ChildSet,
  TimeoutHandle,
  NoTimeout
> = {
  // no `performance.now` in Mini Program
  now: () => Date.now() - startDate,
  scheduleTimeout: setTimeout,
  cancelTimeout: clearTimeout,
  noTimeout: -1,

  supportsMutation: true,
  supportsHydration: false,
  supportsPersistence: false,

  isPrimaryRenderer: true,

  getPublicInstance: instance => {
    if (instance instanceof ElementInstance) {
      const subtreeId = instance.getSubtreeId();

      let componentInstance;

      if (subtreeId === undefined) {
        componentInstance = undefined;
      } else if (subtreeInstances.has(subtreeId)) {
        // If `attached` run before `getPublicInstance` we can get the component instance in sync
        componentInstance = subtreeInstances.get(subtreeId);
      } else {
        // if `attached` have not run, we should wait for attach been called
        componentInstance = new Promise(resolve => {
          events.filteredOnce(
            id => id === String(subtreeId),
            () => resolve(subtreeInstances.get(subtreeId)),
          );
        });
      }

      return {
        unsafe_originalInstance: instance,
        unsafe_gojiId: instance.id,
        getComponentInstance: async () => componentInstance,
      };
    }

    return undefined;
  },

  getRootHostContext: () => ({}),

  shouldSetTextContent() {
    return false;
  },

  prepareForCommit: () => null,

  resetAfterCommit: container => {
    container.requestUpdate();
  },

  getChildHostContext: parentHostContext => parentHostContext,

  prepareUpdate() {
    // FIXME: should use this hook correctly
    return true;
  },

  commitTextUpdate(textInstance, oldText, newText) {
    textInstance.updateText(newText);
  },

  createInstance(type, newProps, rootContainerInstance) {
    const instance = new ElementInstance(type, newProps, [], rootContainerInstance);
    instance.registerEventHandler();

    return instance;
  },

  createTextInstance(text, rootContainerInstance) {
    return new TextInstance(text, rootContainerInstance);
  },

  commitMount() {
    // do nothing
  },

  commitUpdate(targetIns, updatePayload, type, oldProps, newProps) {
    targetIns.updateProps(newProps);
  },

  appendInitialChild: (parent, child) => {
    parent.appendChild(child);
  },

  appendChild(parent, child) {
    parent.appendChild(child);
  },

  insertBefore(parent, child, beforeChild) {
    parent.insertBefore(child, beforeChild);
  },

  insertInContainerBefore(container, child, beforeChild) {
    container.virtualRootElement.insertBefore(child, beforeChild);
  },

  finalizeInitialChildren: () => false,

  appendChildToContainer(container, child) {
    container.virtualRootElement.appendChild(child);
  },

  removeChild(parentInstance, child) {
    parentInstance.removeChild(child);
  },

  removeChildFromContainer(container, child) {
    container.virtualRootElement.removeChild(child);
  },

  clearContainer(container) {
    container.virtualRootElement.clear();
  },

  resetTextContent() {
    // do nothing
  },

  hideInstance: () => {
    // do nothing
  },
  hideTextInstance: () => {
    // do nothing
  },
  unhideInstance: () => {
    // do nothing
  },
  unhideTextInstance: () => {
    // do nothing
  },

  preparePortalMount: () => {},
};
