import { describe, it } from "vitest"

import { NFC_VECTORS } from "./data/nfc-vectors"
import { nfc, nfd } from "./nfc"

describe("nfc.ts", () => {
  it("should match Unicode NormalizationTest vectors", () => {
    const failures: {
      kind: "nfc" | "nfd"
      source: readonly number[]
      expected: readonly number[]
      actual: readonly number[]
    }[] = []

    for (const [
      source,
      expected_nfc,
      expected_nfd,
    ] of NFC_VECTORS) {
      // NormalizationTest invariants:
      //   NFC(source) === expected_nfc
      //   NFD(source) === expected_nfd
      //   NFC(expected_nfd) === expected_nfc
      //   NFD(expected_nfc) === expected_nfd
      const actual_nfc = nfc(source)
      if (
        actual_nfc.length !== expected_nfc.length ||
        actual_nfc.some((cp, i) => cp !== expected_nfc[i])
      ) {
        failures.push({
          kind: "nfc",
          source,
          expected: expected_nfc,
          actual: actual_nfc,
        })
        continue
      }
      const actual_nfd = nfd(source)
      if (
        actual_nfd.length !== expected_nfd.length ||
        actual_nfd.some((cp, i) => cp !== expected_nfd[i])
      ) {
        failures.push({
          kind: "nfd",
          source,
          expected: expected_nfd,
          actual: actual_nfd,
        })
      }
    }

    if (failures.length > 0) {
      const sample = failures
        .slice(0, 10)
        .map(
          (f) =>
            `  ${f.kind} src=[${f.source
              .map((cp) => cp.toString(16))
              .join(",")}] expected=[${f.expected
              .map((cp) => cp.toString(16))
              .join(",")}] got=[${f.actual
              .map((cp) => cp.toString(16))
              .join(",")}]`,
        )
        .join("\n")
      throw new Error(
        `${failures.length}/${NFC_VECTORS.length} vectors failed:\n${sample}`,
      )
    }
  })
})
