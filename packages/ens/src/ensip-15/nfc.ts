// https://www.unicode.org/reports/tr15/
//
// Canonical decomposition (NFD) and composition (NFC) over
// codepoint arrays. Delegates to `@adraffy/ens-normalize`,
// which ships the same algorithm with packed-binary tables.
//
// `to_cps` / `from_cps` are trivial codepoint <-> string
// converters kept here so the public ENSIP-15 surface can
// stay dependency-free of how adraffy structures its API.

export { nfc, nfd } from "@adraffy/ens-normalize"

export function to_cps(text: string): number[] {
  return Array.from(text, (c) => {
    const cp = c.codePointAt(0)
    if (cp === undefined) {
      throw new Error("empty grapheme")
    }
    return cp
  })
}

export function from_cps(cps: readonly number[]): string {
  return String.fromCodePoint(...cps)
}
