import { existsSync } from "node:fs"
import { join } from "node:path"

import { bytes32Schema } from "@ethernauta/core"
import { parse } from "valibot"
import { describe, expect, it } from "vitest"

import { kzgCommitmentSchema, kzgProofSchema } from "../schemas"
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
      if (output === null) {
        expect(() => {
          const commitment = parse(
            kzgCommitmentSchema,
            input.commitment,
          )
          const z = parse(bytes32Schema, input.z)
          const y = parse(bytes32Schema, input.y)
          const proof = parse(kzgProofSchema, input.proof)
          verify_kzg_proof(kzg, commitment, z, y, proof)
        }).toThrow()
        return
      }
      const commitment = parse(
        kzgCommitmentSchema,
        input.commitment,
      )
      const z = parse(bytes32Schema, input.z)
      const y = parse(bytes32Schema, input.y)
      const proof = parse(kzgProofSchema, input.proof)
      const expected = (output as string) === "true"
      expect(
        verify_kzg_proof(kzg, commitment, z, y, proof),
      ).toBe(expected)
    })
  }
})
