import { withContext, CommonContext, CommonContextType } from './helpers/context';

export const renderTemplate = <R>(contextValue: CommonContextType, callback: () => R) =>
  withContext(CommonContext, contextValue, callback);
