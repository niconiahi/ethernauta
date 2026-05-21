import { describe, expect, it } from "vitest"

import { get_contract_address } from "./get-contract-address"

describe("get_contract_address", () => {
  // Vector from the canonical RLP test set: deployer
  // 0x6ac7ea33f8831ea9dcc53393aaa88b25a785dbf0 with nonce 0
  // deploys to 0xcd234a471b72ba2f1ccf0a70fcaba648a5eecd8d.
  // (Reproducible with `cast compute-address --nonce 0
  // 0x6ac7ea33f8831ea9dcc53393aaa88b25a785dbf0`.)
  it("derives the address for nonce 0", () => {
    expect(
      get_contract_address({
        from: "0x6ac7ea33f8831ea9dcc53393aaa88b25a785dbf0",
        nonce: "0x0",
      }),
    ).toBe("0xcd234a471b72ba2f1ccf0a70fcaba648a5eecd8d")
  })

  it("accepts a bigint nonce equivalently to a hex nonce", () => {
    const from =
      "0x6ac7ea33f8831ea9dcc53393aaa88b25a785dbf0"
    const hex_result = get_contract_address({
      from,
      nonce: "0x7",
    })
    const big_result = get_contract_address({
      from,
      nonce: 7n,
    })
    expect(big_result).toBe(hex_result)
  })

  it("derivation differs across nonces", () => {
    const from =
      "0x6ac7ea33f8831ea9dcc53393aaa88b25a785dbf0"
    expect(
      get_contract_address({ from, nonce: "0x0" }),
    ).not.toBe(get_contract_address({ from, nonce: "0x1" }))
  })
})
