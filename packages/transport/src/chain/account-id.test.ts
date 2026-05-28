import { parse } from "valibot"
import { describe, expect, it } from "vitest"

import { AccountIdSchema } from "./account-id"

describe("accountId", () => {
  it("should correctly parse a correct account id", async () => {
    const raw =
      "eip155:1:0xab16a96d359ec26a11e2c2b3d8f8b8942d5bfcdb"
    const account_id = parse(AccountIdSchema, raw)
    expect(account_id).toBe(raw)
  })
})
