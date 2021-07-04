import { withContext, CommonContext, CommonContextType } from './helpers/context';

export const renderTemplate = (contextValue: CommonContextType, callback: () => string) =>
  withContext(CommonContext, contextValue, callback);
