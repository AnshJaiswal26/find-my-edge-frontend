export function useResolvedValue(store, value) {
  return store && typeof value === "function" ? store(value) : value;
}
