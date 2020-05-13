import { HostConfig, OpaqueHandle } from 'react-reconciler';

// This file is used to patch `HostConfig` interface typing from `@types/react-reconciler`
// FIXME: we should create PRs to upstream later

// Remove outdated scheduler configs
// https://github.com/facebook/react/pull/14984
type OmittedSchedulerKeys =
  | 'now'
  | 'setTimeout'
  | 'clearTimeout'
  | 'noTimeout'
  | 'scheduleDeferredCallback'
  | 'cancelDeferredCallback';

// Remove unsupported hydrate configs
// https://github.com/facebook/react/blob/0a527707cd8befd21a741ca9646a8551842190b0/packages/shared/HostConfigWithNoHydration.js
type OmittedHydrationKeys =
  | 'canHydrateInstance'
  | 'canHydrateTextInstance'
  | 'canHydrateSuspenseInstance'
  | 'isSuspenseInstancePending'
  | 'isSuspenseInstanceFallback'
  | 'registerSuspenseInstanceRetry'
  | 'getNextHydratableSibling'
  | 'getFirstHydratableChild'
  | 'hydrateInstance'
  | 'hydrateTextInstance'
  | 'hydrateSuspenseInstance'
  | 'getNextHydratableInstanceAfterSuspenseInstance'
  | 'commitHydratedContainer'
  | 'commitHydratedSuspenseInstance'
  | 'clearSuspenseBoundary'
  | 'clearSuspenseBoundaryFromContainer'
  | 'didNotMatchHydratedContainerTextInstance'
  | 'didNotMatchHydratedTextInstance'
  | 'didNotHydrateContainerInstance'
  | 'didNotHydrateInstance'
  | 'didNotFindHydratableContainerInstance'
  | 'didNotFindHydratableContainerTextInstance'
  | 'didNotFindHydratableContainerSuspenseInstance'
  | 'didNotFindHydratableInstance'
  | 'didNotFindHydratableTextInstance'
  | 'didNotFindHydratableSuspenseInstance';

// Remove unsupported persistence configs
// from https://github.com/facebook/react/blob/2c4d61e1022ae383dd11fe237f6df8451e6f0310/packages/shared/HostConfigWithNoPersistence.js
type OmittedPersistenceKeys =
  | 'cloneInstance'
  | 'cloneFundamentalInstance'
  | 'createContainerChildSet'
  | 'appendChildToContainerChildSet'
  | 'finalizeContainerChildren'
  | 'replaceContainerChildren'
  | 'cloneHiddenInstance'
  | 'cloneHiddenTextInstance';

export type GojiHostConfig<
  Type,
  Props,
  Container,
  Instance,
  TextInstance,
  HydratableInstance,
  PublicInstance,
  HostContext,
  UpdatePayload,
  ChildSet,
  TimeoutHandle,
  NoTimeout
> = Omit<
  HostConfig<
    Type,
    Props,
    Container,
    Instance,
    TextInstance,
    HydratableInstance,
    PublicInstance,
    HostContext,
    UpdatePayload,
    ChildSet,
    TimeoutHandle,
    NoTimeout
  >,
  OmittedSchedulerKeys | OmittedHydrationKeys | OmittedPersistenceKeys
> & {
  // Add missing mutation configs and mark all of them required
  // https://github.com/facebook/react/blob/dac9202a9c5add480f853bcad2ee04d371e72c0c/packages/shared/HostConfigWithNoMutation.js
  appendChild(parentInstance: Instance, child: Instance | TextInstance): void;
  appendChildToContainer(container: Container, child: Instance | TextInstance): void;
  commitTextUpdate(textInstance: TextInstance, oldText: string, newText: string): void;
  commitMount(
    instance: Instance,
    type: Type,
    newProps: Props,
    internalInstanceHandle: OpaqueHandle,
  ): void;
  commitUpdate(
    instance: Instance,
    updatePayload: UpdatePayload,
    type: Type,
    oldProps: Props,
    newProps: Props,
    internalInstanceHandle: OpaqueHandle,
  ): void;
  insertBefore(
    parentInstance: Instance,
    child: Instance | TextInstance,
    beforeChild: Instance | TextInstance,
  ): void;
  insertInContainerBefore(
    container: Container,
    child: Instance | TextInstance,
    beforeChild: Instance | TextInstance,
  ): void;
  removeChild(parentInstance: Instance, child: Instance | TextInstance): void;
  removeChildFromContainer(container: Container, child: Instance | TextInstance): void;
  resetTextContent(instance: Instance): void;
  hideInstance(instance: Instance): void;
  hideTextInstance(textInstance: TextInstance): void;
  unhideInstance(instance: Instance, props: Props): void;
  unhideTextInstance(textInstance: TextInstance, text: string): void;
  // FIXME: all fundamental configs are ignored yet
};
