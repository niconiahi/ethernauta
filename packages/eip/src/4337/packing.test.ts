import {
  AddressSchema,
  BytesSchema,
  UintSchema,
} from "@ethernauta/core"
import { parse } from "valibot"
import { describe, expect, it } from "vitest"

import {
  pack_account_gas_limits,
  pack_gas_fees,
  pack_init_code,
  pack_paymaster_and_data,
  pack_user_operation,
  unpack_uint128_pair,
} from "./packing"
import type { UserOperation } from "./types"

const SENDER = parse(
  AddressSchema,
  "0x1111111111111111111111111111111111111111",
)
const FACTORY = parse(
  AddressSchema,
  "0x2222222222222222222222222222222222222222",
)
const PAYMASTER = parse(
  AddressSchema,
  "0x3333333333333333333333333333333333333333",
)
const ZERO_ADDRESS = parse(
  AddressSchema,
  "0x0000000000000000000000000000000000000000",
)

describe("packing.ts — pack_account_gas_limits", () => {
  it("should produce 32 bytes with verification high, call low", () => {
    const packed = pack_account_gas_limits(
      parse(UintSchema, "0x100"),
      parse(UintSchema, "0x200"),
    )
    expect(packed).toBe(
      "0x0000000000000000000000000000010000000000000000000000000000000200",
    )
    const { hi, lo } = unpack_uint128_pair(packed)
    expect(BigInt(hi)).toBe(0x100n)
    expect(BigInt(lo)).toBe(0x200n)
  })

  it("should reject values exceeding uint128", () => {
    expect(() =>
      pack_account_gas_limits(
        parse(
          UintSchema,
          "0x100000000000000000000000000000000",
        ),
        parse(UintSchema, "0x0"),
      ),
    ).toThrow()
  })
})

describe("packing.ts — pack_gas_fees", () => {
  it("should round-trip the priority / max pair", () => {
    const packed = pack_gas_fees(
      parse(UintSchema, "0x1"),
      parse(UintSchema, "0x10"),
    )
    const { hi, lo } = unpack_uint128_pair(packed)
    expect(BigInt(hi)).toBe(1n)
    expect(BigInt(lo)).toBe(16n)
  })
})

describe("packing.ts — pack_init_code", () => {
  it("should return 0x when no factory", () => {
    expect(pack_init_code(undefined)).toBe("0x")
  })

  it("should return 0x when factory is the zero address", () => {
    expect(
      pack_init_code(
        ZERO_ADDRESS,
        parse(BytesSchema, "0xdeadbeef"),
      ),
    ).toBe("0x")
  })

  it("should concat factory + factoryData", () => {
    expect(
      pack_init_code(
        FACTORY,
        parse(BytesSchema, "0xdeadbeef"),
      ),
    ).toBe(`${FACTORY}deadbeef`.toLowerCase())
  })
})

describe("packing.ts — pack_paymaster_and_data", () => {
  it("should return 0x when no paymaster", () => {
    expect(
      pack_paymaster_and_data({ paymaster: undefined }),
    ).toBe("0x")
  })

  it("should concat paymaster + gas limits + data", () => {
    const packed = pack_paymaster_and_data({
      paymaster: PAYMASTER,
      paymasterVerificationGasLimit: parse(
        UintSchema,
        "0x10",
      ),
      paymasterPostOpGasLimit: parse(UintSchema, "0x20"),
      paymasterData: parse(BytesSchema, "0xab"),
    })
    expect(packed.length).toBe(2 + 40 + 32 + 32 + 2)
    expect(packed.startsWith(PAYMASTER.toLowerCase())).toBe(
      true,
    )
    expect(packed.endsWith("ab")).toBe(true)
  })
})

describe("packing.ts — pack_user_operation", () => {
  it("should pack composite fields and pass through scalars", () => {
    const op: UserOperation = {
      sender: SENDER,
      nonce: parse(UintSchema, "0x1"),
      factory: FACTORY,
      factoryData: parse(BytesSchema, "0xfeed"),
      callData: parse(BytesSchema, "0x"),
      callGasLimit: parse(UintSchema, "0x200"),
      verificationGasLimit: parse(UintSchema, "0x100"),
      preVerificationGas: parse(UintSchema, "0x300"),
      maxFeePerGas: parse(UintSchema, "0x10"),
      maxPriorityFeePerGas: parse(UintSchema, "0x1"),
      signature: parse(BytesSchema, "0x"),
    }
    const packed = pack_user_operation(op)
    expect(packed.sender).toBe(SENDER)
    expect(packed.nonce).toBe("0x1")
    expect(packed.initCode).toBe(
      `${FACTORY.toLowerCase()}feed`,
    )
    expect(packed.callData).toBe("0x")
    expect(packed.preVerificationGas).toBe("0x300")
    const gas = unpack_uint128_pair(packed.accountGasLimits)
    expect(BigInt(gas.hi)).toBe(0x100n)
    expect(BigInt(gas.lo)).toBe(0x200n)
    const fees = unpack_uint128_pair(packed.gasFees)
    expect(BigInt(fees.hi)).toBe(0x1n)
    expect(BigInt(fees.lo)).toBe(0x10n)
  })
})
