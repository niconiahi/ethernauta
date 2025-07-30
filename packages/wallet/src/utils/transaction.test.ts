import { describe, it, expect } from "vitest"
import type { RecoveredSignature } from "@noble/secp256k1"
import { encode } from "@ethereumjs/rlp"
import {
  encode_eip155_transaction_unsigned,
  type Eip1559TransactionUnsigned,
  big_to_bytes,
  concat_bytes,
  make_transaction_hash,
  sign_transaction,
  compose_y_parity,
  encode_access_list,
  make_unsigned_fields,
  make_signed_fields,
  encode_fields,
} from "./transaction.js"

// Test data
const TEST_PRIVATE_KEY = new Uint8Array([
  0x4c, 0x0c, 0x93, 0x2c, 0x6f, 0x2c, 0x03, 0x04, 0x6c,
  0x3c, 0x2c, 0x5c, 0x6f, 0x3c, 0x03, 0x0c, 0x4c, 0x0c,
  0x93, 0x2c, 0x6f, 0x2c, 0x03, 0x04, 0x6c, 0x3c, 0x2c,
  0x5c, 0x6f, 0x3c, 0x03, 0x0c,
])

const TEST_TRANSACTION: Eip1559TransactionUnsigned = {
  chain_id: 1n,
  nonce: 42n,
  max_priority_fee_per_gas: 2000000000n,
  max_fee_per_gas: 20000000000n,
  gas_limit: 21000n,
  to: "0x742d35Cc6635C0532925a3b8D83C2D2d88Ca7c38",
  value: 1000000000000000000n,
  data: new Uint8Array(),
  access_list: [],
}

// Import internal functions for testing (these would need to be exported)
// Note: You'll need to export these from transaction.ts temporarily for testing

describe("Transaction Atomic Functions", () => {
  describe("big_to_bytes", () => {
    it("should handle zero value", () => {
      const result = big_to_bytes(0n)
      expect(result).toEqual(new Uint8Array())
    })

    it("should handle small values", () => {
      const result = big_to_bytes(255n)
      expect(result).toEqual(new Uint8Array([0xff]))
    })

    it("should handle large values with proper padding", () => {
      const result = big_to_bytes(0x1234n)
      expect(result).toEqual(new Uint8Array([0x12, 0x34]))
    })
  })

  describe("concat_bytes", () => {
    it("should concatenate two arrays", () => {
      const arr1 = new Uint8Array([1, 2])
      const arr2 = new Uint8Array([3, 4])
      const result = concat_bytes(arr1, arr2)
      expect(result).toEqual(new Uint8Array([1, 2, 3, 4]))
    })

    it("should handle empty arrays", () => {
      const arr1 = new Uint8Array()
      const arr2 = new Uint8Array([1, 2])
      const result = concat_bytes(arr1, arr2)
      expect(result).toEqual(new Uint8Array([1, 2]))
    })
  })

  describe("make_transaction_hash", () => {
    it("should create hash with type prefix", () => {
      const type_prefix = new Uint8Array([0x02])
      const encoded_fields = new Uint8Array([0xc0]) // Empty RLP list
      const result = make_transaction_hash(
        type_prefix,
        encoded_fields,
      )
      expect(result).toBeInstanceOf(Uint8Array)
      expect(result.length).toBe(32) // Keccak-256 output length
    })
  })

  describe("sign_transaction", () => {
    it("should sign hash with private key", () => {
      const hash = new Uint8Array(32).fill(0x01)
      const result = sign_transaction(
        hash,
        TEST_PRIVATE_KEY,
      )
      expect(result).toHaveProperty("r")
      expect(result).toHaveProperty("s")
      expect(result).toHaveProperty("recovery")
    })
  })

  describe("compose_y_parity", () => {
    it("should convert recovery ID to bigint", () => {
      const result = compose_y_parity(0)
      expect(result).toBe(0n)
    })

    it("should handle recovery ID 1", () => {
      const result = compose_y_parity(1)
      expect(result).toBe(1n)
    })
  })

  describe("encode_access_list", () => {
    it("should handle empty access list", () => {
      const result = encode_access_list([])
      expect(result).toEqual([])
    })

    it("should encode access list with one item", () => {
      const access_list = [
        {
          address:
            "0x742d35Cc6635C0532925a3b8D83C2D2d88Ca7c38",
          storage_keys: [
            "0x0000000000000000000000000000000000000000000000000000000000000001",
          ],
        },
      ]
      const result = encode_access_list(access_list)
      expect(result).toHaveLength(1)
      expect(result[0]).toHaveLength(2) // [address, storage_keys]
    })
  })

  describe("make_unsigned_fields", () => {
    it("should create 9 transaction fields", () => {
      const result = make_unsigned_fields(TEST_TRANSACTION)
      expect(result).toHaveLength(9)
      expect(result[0]).toBeInstanceOf(Uint8Array) // chain_id
      expect(result[8]).toEqual([]) // empty access_list
    })
  })

  describe("make_signed_fields", () => {
    it("should create 12 fields with signature", () => {
      const unsigned_fields = new Array(9).fill(
        new Uint8Array([0x01]),
      )
      const signature = {
        r: 0x123n,
        s: 0x456n,
        recovery: 0,
      } as RecoveredSignature

      const result = make_signed_fields(
        unsigned_fields,
        signature,
      )
      expect(result).toHaveLength(12)
      // Last 3 fields should be signature components
    })
  })

  describe("encode_fields", () => {
    it("should RLP encode field array", () => {
      const fields = [
        new Uint8Array([0x01]),
        new Uint8Array([0x02]),
      ]
      const result = encode_fields(fields)
      expect(result).toBeInstanceOf(Uint8Array)
      // Should be equivalent to encode(fields)
      const expected = encode(fields)
      expect(result).toEqual(expected)
    })
  })
})

describe("Integration Test", () => {
  it("should produce valid EIP-1559 transaction", () => {
    const result = encode_eip155_transaction_unsigned(
      TEST_TRANSACTION,
      TEST_PRIVATE_KEY,
    )

    expect(result).toBeInstanceOf(Uint8Array)
    expect(result[0]).toBe(0x02) // Should start with EIP-1559 type byte
    expect(result.length).toBeGreaterThan(100) // Should be reasonably sized
  })
})
