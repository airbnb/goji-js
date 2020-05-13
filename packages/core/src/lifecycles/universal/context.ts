import { createContext } from 'react';
import { EventEmitter } from 'events';
import { UniversalLifecycleName } from '../types';

interface UniversalHooksContextType {
  cache: Map<UniversalLifecycleName, any>;
  events: EventEmitter;
}

export const UniversalHooksContext = createContext<UniversalHooksContextType | undefined>(
  undefined,
);
