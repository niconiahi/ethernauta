// Stable content-derived key for list items rendered in the sign /
// sign-typed-data views. Biome's `noArrayIndexKey` bans `i` as the
// React key; we never reorder these lists, but the rule has no
// "display-only" exemption — the principled answer is to key on the
// value itself. Equal sibling values produce equal keys (Preact will
// emit a duplicate-key warning); for static display data that's
// harmless — the rendered rows are identical anyway.

export function row_key<T>(
  prefix: string,
  value: T,
): string {
  if (value === null) return `${prefix}:null`
  if (value === undefined) return `${prefix}:undefined`
  const t = typeof value
  if (t === "string" || t === "number" || t === "boolean") {
    return `${prefix}:${t}:${String(value)}`
  }
  if (t === "bigint") return `${prefix}:bigint:${value}`
  if (value instanceof Uint8Array) {
    const head = Array.from(value.slice(0, 16)).join(",")
    return `${prefix}:bytes:${value.length}:${head}`
  }
  try {
    return `${prefix}:${JSON.stringify(value, (_, v) =>
      typeof v === "bigint" ? `${v}n` : v,
    )}`
  } catch {
    return `${prefix}:${String(value)}`
  }
}
