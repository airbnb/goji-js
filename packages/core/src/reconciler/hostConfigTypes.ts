import { HostConfig } from 'react-reconciler';
import { Required } from 'utility-types';

// Mark all mutation methods as required
// https://github.com/facebook/react/blob/dac9202a9c5add480f853bcad2ee04d371e72c0c/packages/shared/HostConfigWithNoMutation.js
type RequiredKeys =
  | 'appendChild'
  | 'appendChildToContainer'
  | 'commitTextUpdate'
  | 'commitMount'
  | 'commitUpdate'
  | 'insertBefore'
  | 'insertInContainerBefore'
  | 'removeChild'
  | 'removeChildFromContainer'
  | 'resetTextContent'
  | 'hideInstance'
  | 'hideTextInstance'
  | 'unhideInstance'
  | 'unhideTextInstance';

export type GojiHostConfig<
  Type,
  Props,
  Container,
  Instance,
  TextInstance,
  SuspenseInstance,
  HydratableInstance,
  PublicInstance,
  HostContext,
  UpdatePayload,
  ChildSet,
  TimeoutHandle,
  NoTimeout,
> = Required<
  HostConfig<
    Type,
    Props,
    Container,
    Instance,
    TextInstance,
    SuspenseInstance,
    HydratableInstance,
    PublicInstance,
    HostContext,
    UpdatePayload,
    ChildSet,
    TimeoutHandle,
    NoTimeout
  >,
  RequiredKeys
>;
