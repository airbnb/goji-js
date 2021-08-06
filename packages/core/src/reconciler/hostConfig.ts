import { Container } from '../container';
import { InstanceProps, ElementInstance, TextInstance } from './instance';
import { GojiHostConfig } from './hostConfigTypes';
import { PublicInstance, subtreeInstances } from './publicInstance';
import events from '../subtreeAttachEvents';

export const hostConfig: GojiHostConfig<
  string,
  InstanceProps,
  Container,
  ElementInstance,
  TextInstance,
  unknown,
  PublicInstance | undefined,
  {},
  boolean,
  unknown,
  unknown,
  unknown
> = {
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
          events.on(String(subtreeId), () => resolve(subtreeInstances.get(subtreeId)));
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

  shouldDeprioritizeSubtree: () => false,

  getRootHostContext: () => ({}),

  shouldSetTextContent() {
    return false;
  },

  prepareForCommit: () => {},

  resetAfterCommit: container => {
    container.requestUpdate();
  },

  getChildHostContext: () => ({}),

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
    child.unregisterEventHandler();
    parentInstance.removeChild(child);
  },

  removeChildFromContainer(container, child) {
    child.unregisterEventHandler();
    container.virtualRootElement.removeChild(child);
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
};
