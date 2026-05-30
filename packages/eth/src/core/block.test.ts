import { invariant } from "@ethernauta/utils"
import { parse } from "valibot"
import { describe, expect, it } from "vitest"
import { BlockSchema, BlockTagSchema } from "./block"

const ADDR = "0x70997970c51812dc3a010c7d01b50e0d17dc79c8"
const HASH = `0x${"a".repeat(64)}`
const HASH_B = `0x${"b".repeat(64)}`
const HASH_C = `0x${"c".repeat(64)}`
const NONCE_8 = `0x${"00".repeat(8)}`
const BLOOM_256 = `0x${"00".repeat(256)}`
const ANY_BYTES = "0xab"

describe("BlockTagSchema", () => {
  it.each([
    "earliest",
    "latest",
    "pending",
    "safe",
    "finalized",
  ])("admits %s", (tag) => {
    expect(parse(BlockTagSchema, tag)).toBe(tag)
  })

  it("rejects unknown tag", () => {
    expect(() =>
      parse(BlockTagSchema, "yesterday"),
    ).toThrow()
  })
})

describe("BlockSchema — post-Cancun shape", () => {
  it("parses a block carrying withdrawals + blob gas + parentBeaconBlockRoot", () => {
    const block = {
      hash: HASH,
      parentHash: HASH_B,
      sha3Uncles: HASH_C,
      miner: ADDR,
      stateRoot: HASH,
      transactionsRoot: HASH,
      receiptsRoot: HASH,
      logsBloom: BLOOM_256,
      number: "0x1",
      gasLimit: "0x1",
      gasUsed: "0x1",
      timestamp: "0x1",
      extraData: ANY_BYTES,
      mixHash: HASH,
      nonce: NONCE_8,
      size: "0x1",
      transactions: [],
      uncles: [],
      withdrawals: [
        {
          index: "0x1",
          validatorIndex: "0x2",
          address: ADDR,
          amount: "0x3",
        },
      ],
      withdrawalsRoot: HASH,
      blobGasUsed: "0x1",
      excessBlobGas: "0x2",
      parentBeaconBlockRoot: HASH,
    }
    const parsed = parse(BlockSchema, block)
    expect(parsed.withdrawals).toHaveLength(1)
    const withdrawal0 = parsed.withdrawals?.[0]
    invariant(withdrawal0, "expected one withdrawal")
    expect(withdrawal0.address).toBe(ADDR)
    expect(parsed.withdrawalsRoot).toBe(HASH)
    expect(parsed.blobGasUsed).toBe("0x1")
    expect(parsed.excessBlobGas).toBe("0x2")
  })

  it("parses a pre-Shanghai block (no withdrawals, no blob fields)", () => {
    const block = {
      hash: HASH,
      parentHash: HASH_B,
      sha3Uncles: HASH_C,
      miner: ADDR,
      stateRoot: HASH,
      transactionsRoot: HASH,
      receiptsRoot: HASH,
      logsBloom: BLOOM_256,
      number: "0x1",
      gasLimit: "0x1",
      gasUsed: "0x1",
      timestamp: "0x1",
      extraData: ANY_BYTES,
      mixHash: HASH,
      nonce: NONCE_8,
      size: "0x1",
      transactions: [],
      uncles: [],
    }
    const parsed = parse(BlockSchema, block)
    expect(parsed.withdrawals).toBeUndefined()
    expect(parsed.blobGasUsed).toBeUndefined()
  })
})
