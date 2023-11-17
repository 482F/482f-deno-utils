export function isNotNullish(val: unknown): val is Record<string, unknown> {
  return val != null
}
