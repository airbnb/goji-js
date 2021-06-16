import { GojiTarget } from '@goji/core';
import { createContext } from '../helper';

export interface CommonContextType {
  target: GojiTarget;
}

export const CommonContext = createContext<CommonContextType>();
