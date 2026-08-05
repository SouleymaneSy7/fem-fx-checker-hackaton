type OptimisticMutationParamsType<T> = {
  apply: () => void;
  rollback: () => void;
  request: () => Promise<T>;
  onSuccess?: (result: T) => void;
};

// Shared control flow behind every "update the store immediately, tell
// the server, undo the store change if the server disagrees" mutation in
// this app (favorites, log, alerts, recent pairs) — keeps that sequence
// identical everywhere instead of four slightly different hand-rolled
// versions of the same three steps.
//
// `onSuccess` is for cases where the optimistic state needs reconciling
// once the real server response lands — e.g. log/alert entries get a
// client-generated temp id when applied optimistically, which onSuccess
// then swaps for the server-assigned one. Actions whose optimistic id is
// already final (favorites, recent pairs use a deterministic `from-to`
// id) don't need it.
export async function runOptimisticMutation<T>({
  apply,
  rollback,
  request,
  onSuccess,
}: OptimisticMutationParamsType<T>): Promise<T | undefined> {
  apply();

  try {
    const result = await request();
    onSuccess?.(result);
    return result;
  } catch {
    rollback();
    return undefined;
  }
}
