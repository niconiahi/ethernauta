import { existsSync } from "node:fs"
import { join } from "node:path"

import { bytes32Schema } from "@ethernauta/core"
import { parse } from "valibot"
import { describe, expect, it } from "vitest"

import { blobSchema } from "../schemas"
import { compute_kzg_proof } from "./compute-kzg-proof"
import {
  list_kzg_cases,
  load_kzg_from_txt,
  parse_kzg_yaml,
} from "./test-helpers"

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
  "tests/general/deneb/kzg/compute_kzg_proof/kzg-mainnet",
)

const have_fixtures =
  existsSync(SETUP_PATH) && existsSync(CASES_DIR)

const suite = have_fixtures ? describe : describe.skip

suite("EF KZG vectors — compute_kzg_proof", () => {
  const kzg = load_kzg_from_txt(SETUP_PATH)
  const cases = list_kzg_cases(CASES_DIR)

  for (const c of cases) {
    it(c.name, () => {
      const { input, output } = parse_kzg_yaml(c.path)
      if (output === null) {
        expect(() => {
          const blob = parse(blobSchema, input.blob)
          const z = parse(bytes32Schema, input.z)
          compute_kzg_proof(kzg, blob, z)
        }).toThrow()
        return
      }
      const blob = parse(blobSchema, input.blob)
      const z = parse(bytes32Schema, input.z)
      const [proof, y] = compute_kzg_proof(kzg, blob, z)
      const [expected_proof, expected_y] =
        output as string[]
      expect(proof).toBe(
        (expected_proof as string).toLowerCase(),
      )
      expect(y).toBe((expected_y as string).toLowerCase())
    })
  }
})
