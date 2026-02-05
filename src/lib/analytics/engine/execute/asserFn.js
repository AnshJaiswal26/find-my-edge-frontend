export function assertFn(name, fn) {
  if (typeof fn !== "function") {
    throw new Error(`computeOverSequence: '${name}' must be a function`);
  }
}
