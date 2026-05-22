import { existsSync } from "node:fs"
import { join } from "node:path"

import { describe, expect, it } from "vitest"

import {
  list_kzg_cases,
  load_kzg_from_txt,
  parse_kzg_yaml,
} from "./test-helpers"
import { verify_blob_kzg_proof } from "./verify-blob-kzg-proof"

const FIXTURES = join(
  import.meta.dirname,
  "..",
  "..",
  "..",
  "__fixtures__",
)
const SETUP_PATH = join(FIXTURES, "trusted_setup.txt")
const CASES_DIR = join(
  FIXTURES,
  "tests/general/deneb/kzg/verify_blob_kzg_proof/kzg-mainnet",
)

const have_fixtures =
  existsSync(SETUP_PATH) && existsSync(CASES_DIR)

const suite = have_fixtures ? describe : describe.skip

suite("EF KZG vectors — verify_blob_kzg_proof", () => {
  const kzg = load_kzg_from_txt(SETUP_PATH)
  const cases = list_kzg_cases(CASES_DIR)

  for (const c of cases) {
    it(c.name, () => {
      const { input, output } = parse_kzg_yaml(c.path)
      const blob = input.blob as `0x${string}`
      const commitment = input.commitment as `0x${string}`
      const proof = input.proof as `0x${string}`
      if (output === null) {
        expect(() =>
          verify_blob_kzg_proof(
            kzg,
            blob,
            commitment,
            proof,
          ),
        ).toThrow()
        return
      }
      const expected = (output as string) === "true"
      expect(
        verify_blob_kzg_proof(kzg, blob, commitment, proof),
      ).toBe(expected)
    })
  }
})
