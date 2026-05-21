import { parse } from "valibot"
import { describe, expect, it } from "vitest"
import {
  caveatSchema,
  permissionSchema,
  requestedPermissionSchema,
} from "./permission"

describe("permission.ts", () => {
  it("should validate a complete caveat", () => {
    const caveat = {
      type: "restrictReturnedAccounts",
      value: ["0xabc"],
    }
    expect(() => parse(caveatSchema, caveat)).not.toThrow()
  })

  it("should validate a minimum eth_accounts permission", () => {
    const perm = {
      parentCapability: "eth_accounts",
      caveats: [],
    }
    expect(() =>
      parse(permissionSchema, perm),
    ).not.toThrow()
  })

  it("should validate a full permission with optional fields", () => {
    const perm = {
      invoker: "https://example.com",
      parentCapability: "eth_accounts",
      caveats: [
        {
          type: "restrictReturnedAccounts",
          value: ["0xabc"],
        },
      ],
      date: 1700000000000,
      id: "abc-123",
    }
    expect(() =>
      parse(permissionSchema, perm),
    ).not.toThrow()
  })

  it("should reject when parentCapability is missing", () => {
    const perm = { caveats: [] }
    expect(() => parse(permissionSchema, perm)).toThrow()
  })

  it("should accept a wallet_requestPermissions input", () => {
    const requested = { eth_accounts: {} }
    expect(() =>
      parse(requestedPermissionSchema, requested),
    ).not.toThrow()
  })
})
