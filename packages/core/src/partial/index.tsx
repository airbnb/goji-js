import React, { createContext, useRef, useContext, Suspense, useEffect, ReactElement } from 'react';
import { useRenderedEffect } from '../lifecycles';

// PartialContext maintains a promise chain to control the render order
const createPartialContextValue = () => {
  let chain: Promise<any> = Promise.resolve();

  // register will create a promise and link it to the promise chain,
  // then return its predecessor and the resolver of the new created promise.
  const register = () => {
    let resolver;
    const currentPromise = chain;
    const nextPromise = new Promise<undefined>(resolve => {
      resolver = () => resolve(undefined);
    });

    chain = chain.then(() => nextPromise);

    return [currentPromise, resolver];
  };

  return {
    register,
  };
};

const PartialContext = createContext(createPartialContextValue());

export const PartialProvider = ({ children }) => (
    <PartialContext.Provider value={createPartialContextValue()}>
      {children}
    </PartialContext.Provider>
  );

// Let's imagine there are only two Partial Components on the page,
// the first component will throw the very first promise in the chain which is already resolved,
// meanwhile the second component will throw the second promise which is chained after the first promise,
// since the first promise is resolved, first component will start rendering children,
// when its children are rendered (useRenderedEffect), first component will call the resolver of the second promise,
// then the second compnent will start rendering children.
const DelayComp = ({ children, promise, resolver }) => {
  if (promise.current !== null && resolver.current) {
    throw promise.current;
  }

  useRenderedEffect(() => {
    if (resolver.current) {
      resolver.current();
      resolver.current = null;
    }
  }, [promise.current]); // eslint-disable-line react-hooks/exhaustive-deps

  return children;
};

export const Partial = ({
  children,
  fallback,
}: React.PropsWithChildren<{ fallback?: ReactElement }>) => {
  const pending = useRef(true);
  const { register } = useContext(PartialContext);
  const resolverRef = useRef(null);
  const promiseRef = useRef(null);

  if (pending.current) {
    const [promise, resolver] = register();
    resolverRef.current = resolver;
    promiseRef.current = promise;
  }

  useEffect(() => {
    pending.current = false;
    promiseRef.current = null;
  }, []);

  return (
    <Suspense fallback={fallback || null}>
      <DelayComp promise={promiseRef} resolver={resolverRef}>
        {children}
      </DelayComp>
    </Suspense>
  );
};
