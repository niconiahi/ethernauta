import { existsSync } from "node:fs"
import { join } from "node:path"

import { describe, expect, it } from "vitest"

import {
  list_kzg_cases,
  load_kzg_from_txt,
  parse_kzg_yaml,
} from "./test-helpers"
import { verify_kzg_proof } from "./verify-kzg-proof"

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
  "tests/general/deneb/kzg/verify_kzg_proof/kzg-mainnet",
)

const have_fixtures =
  existsSync(SETUP_PATH) && existsSync(CASES_DIR)

const suite = have_fixtures ? describe : describe.skip

suite("EF KZG vectors — verify_kzg_proof", () => {
  const kzg = load_kzg_from_txt(SETUP_PATH)
  const cases = list_kzg_cases(CASES_DIR)

  for (const c of cases) {
    it(c.name, () => {
      const { input, output } = parse_kzg_yaml(c.path)
      const commitment = input.commitment as `0x${string}`
      const z = input.z as `0x${string}`
      const y = input.y as `0x${string}`
      const proof = input.proof as `0x${string}`
      if (output === null) {
        expect(() =>
          verify_kzg_proof(kzg, commitment, z, y, proof),
        ).toThrow()
        return
      }
      const expected =
        (output as string) === "true" ? true : false
      expect(
        verify_kzg_proof(kzg, commitment, z, y, proof),
      ).toBe(expected)
    })
  }
})
