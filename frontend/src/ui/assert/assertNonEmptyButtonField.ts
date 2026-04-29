export function assertNonEmptyButtonField(value: string, field: string) {
  if (!value || !value.trim()) {
    throw new Error(`Button ${field} cannot be empty`);
  }
}
