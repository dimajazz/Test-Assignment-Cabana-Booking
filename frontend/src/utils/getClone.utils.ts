export function getClone<T>(value: T): T {
  return structuredClone(value);
}
