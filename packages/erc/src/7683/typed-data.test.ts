import { encode_type } from "@ethernauta/eip/712"
import { describe, expect, it } from "vitest"

import {
  GASLESS_CROSS_CHAIN_ORDER_FIELDS,
  GASLESS_PRIMARY_TYPE,
  make_gasless_order_typed_data,
} from "./typed-data"

const EXPECTED_TYPE_STRING =
  "GaslessCrossChainOrder(address originSettler,address user,uint256 nonce,uint256 originChainId,uint32 openDeadline,uint32 fillDeadline,bytes32 orderDataType,bytes orderData)"

describe("typed-data.ts — encode_type", () => {
  it("should match the spec EIP-712 type string", () => {
    const types = {
      [GASLESS_PRIMARY_TYPE]: [
        ...GASLESS_CROSS_CHAIN_ORDER_FIELDS,
      ],
    }
    expect(encode_type(GASLESS_PRIMARY_TYPE, types)).toBe(
      EXPECTED_TYPE_STRING,
    )
  })
})

describe("typed-data.ts — make_gasless_order_typed_data", () => {
  it("should produce typed data with primaryType and proper domain", () => {
    const td = make_gasless_order_typed_data({
      order: {
        originSettler:
          "0x1111111111111111111111111111111111111111",
        user: "0x2222222222222222222222222222222222222222",
        nonce: "0x1",
        originChainId: "0xaa36a7",
        openDeadline: "0x6800",
        fillDeadline: "0x6800",
        orderDataType: `0x${"00".repeat(32)}`,
        orderData: "0x",
      },
      domain: {
        name: "Test Settler",
        version: "1",
        chainId: 11155111,
        verifyingContract:
          "0x1111111111111111111111111111111111111111",
      },
    })
    expect(td.primaryType).toBe(GASLESS_PRIMARY_TYPE)
    expect(td.domain.chainId).toBe(11155111)
    expect(td.types[GASLESS_PRIMARY_TYPE]?.[0]?.name).toBe(
      "originSettler",
    )
  })
})
