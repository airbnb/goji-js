import { createContext } from 'react';
import { CachedEventChannel } from '../../utils/eventChannel';
import { OnLoadOptions } from '../types';

export interface UniversalHooksContextType {
  universalLifecycleChannel: {
    loadOptions: CachedEventChannel<OnLoadOptions>;
    visibility: CachedEventChannel<boolean>;
  };
}

export const UniversalHooksContext = createContext<UniversalHooksContextType | undefined>(
  undefined,
);
