import {
  bytes,
  encode_function_call,
  to_selector,
} from "@ethernauta/abi"
import { BytesSchema } from "@ethernauta/core"
import {
  bytes_to_hex,
  hex_to_bytes,
} from "@ethernauta/utils"
import { parse } from "valibot"
import { describe, expect, it } from "vitest"

import {
  L1_MESSENGER_ADDRESS,
  SEND_TO_L1_SIGNATURE,
} from "."

describe("l1-messenger", () => {
  it("should pin the L2 predeploy address", () => {
    expect(L1_MESSENGER_ADDRESS).toBe(
      "0x0000000000000000000000000000000000008008",
    )
  })

  it("should encode sendToL1 calldata with the right selector", () => {
    const calldata = encode_function_call({
      name: "sendToL1",
      args: [bytes()] as const,
      values: [parse(BytesSchema, "0xdeadbeef")] as const,
    })
    const data = bytes_to_hex(calldata)
    const expected_selector = bytes_to_hex(
      to_selector(SEND_TO_L1_SIGNATURE.signature),
    )
    expect(data.slice(0, 10)).toBe(expected_selector)
    expect(hex_to_bytes(data).length).toBeGreaterThan(4)
  })
})
