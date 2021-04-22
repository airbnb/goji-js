import { useRef, useEffect, useCallback, EffectCallback, useMemo } from 'react';

// this hook will run during component rendering rather than after it
// it is useful to update component in the same rendering tick like https://reactjs.org/docs/hooks-faq.html#how-do-i-implement-getderivedstatefromprops
// NOTE: this hook might not work in concurrent mode
export const useImmediatelyEffect = <T extends Array<any>>(callback: EffectCallback, deps?: T) => {
  const unsubscribeRef = useRef<ReturnType<EffectCallback>>(undefined);

  const resolveUnsubscribe = useCallback(() => {
    if (unsubscribeRef.current) {
      unsubscribeRef.current();
      unsubscribeRef.current = undefined;
    }
  }, []);

  // re-run callback only if `deps` changed
  unsubscribeRef.current = useMemo(() => {
    resolveUnsubscribe();
    return callback();
  }, deps); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    return resolveUnsubscribe;
  }, [resolveUnsubscribe]);
};
