import { withContext } from './helper';
import { CommonContext, CommonContextType } from './context';

export const renderTemplate = (contextValue: CommonContextType, callback: () => string) =>
  withContext(CommonContext, contextValue, callback);
