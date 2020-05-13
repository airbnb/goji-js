import { useContext } from 'react';
import { UniversalLifecycleName, OnLoadOptions } from '../types';
import { UniversalHooksContext } from './context';
import { useImmediatelyEffect } from '../../utils/effects';

const createUniversalLifecycleHook = <T = undefined>(name: UniversalLifecycleName) => {
  return (callback: (data: T) => void, deps?: Array<any>) => {
    const universalHooksContext = useContext(UniversalHooksContext);
    if (!universalHooksContext) {
      throw new Error(
        'Cannot found `universalHooksContext`. This might be an internal error in GojiJS.',
      );
    }
    const { cache, events } = universalHooksContext;

    // check cache and run callback at the first rendering
    useImmediatelyEffect(() => {
      if (cache.has(name)) {
        callback(cache.get(name));
      }
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    useImmediatelyEffect(() => {
      events.on(name, callback);
      return () => {
        events.removeListener(name, callback);
      };
    }, deps); // eslint-disable-line react-hooks/exhaustive-deps
  };
};

export const useLoadOptions = createUniversalLifecycleHook<OnLoadOptions>('loadOptions');
export const useVisibility = createUniversalLifecycleHook<boolean>('visibility');
