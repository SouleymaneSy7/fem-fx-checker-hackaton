import * as React from "react";

// Generic "React Context + Provider + safe accessor hook" factory —
// throws a clear error if the hook is ever called outside its own
// Provider, instead of silently returning `undefined` and failing later
// with a confusing "cannot read property of undefined". Used by compound
// components (e.g. Switch's press-state sharing between the track and
// the thumb) that need to share state across siblings without prop
// drilling.
function getStrictContext<T>(
  name?: string,
): readonly [
  (props: { value: T; children?: React.ReactNode }) => React.ReactElement,
  () => T,
] {
  const Context = React.createContext<T | undefined>(undefined);

  function Provider({
    value,
    children,
  }: {
    value: T;
    children?: React.ReactNode;
  }) {
    return React.createElement(Context.Provider, { value }, children);
  }

  function useSafeContext(): T {
    const context = React.useContext(Context);

    if (context === undefined) {
      throw new Error(`useContext must be used within ${name ?? "a Provider"}`);
    }

    return context;
  }

  return [Provider, useSafeContext] as const;
}

export { getStrictContext };
