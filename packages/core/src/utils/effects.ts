import { useRef, useEffect, EffectCallback, useMemo } from 'react';

/**
 * This hook runs during component rendering rather than after it
 * It is useful when updating component in the same rendering tick like https://reactjs.org/docs/hooks-faq.html#how-do-i-implement-getderivedstatefromprops
 * @note this hook might not work in concurrent mode
 */
export const useImmediatelyEffect = <T extends Array<any>>(callback: EffectCallback, deps?: T) => {
  const unsubscribeRef = useRef<ReturnType<EffectCallback>>(undefined);

  // re-run callback only if `deps` changed
  unsubscribeRef.current = useMemo(() => {
    const unsubscribe = unsubscribeRef.current;
    unsubscribeRef.current = undefined;
    unsubscribe?.();
    return callback();
  }, deps); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(
    () => () => {
      const unsubscribe = unsubscribeRef.current;
      unsubscribeRef.current = undefined;
      unsubscribe?.();
    },
    [],
  );
};
