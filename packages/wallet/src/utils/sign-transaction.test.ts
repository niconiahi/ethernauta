import { describe, it, expect } from "vitest"
import type { RecoveredSignature } from "@noble/secp256k1"
import {
  encode_eip155_transaction_unsigned,
  type Eip1559TransactionUnsigned,
  big_to_bytes,
  concat_bytes,
  make_transaction_hash,
  compose_y_parity,
  encode_access_list,
  make_unsigned_fields,
  make_signed_fields,
  encode_fields,
  sign_transaction_hash,
  get_nonce,
} from "./sign-transaction"
import { encode } from "./rlp"
import { HDKey } from "@scure/bip32"
import { sepolia } from "viem/chains"
import { privateKeyToAccount } from "viem/accounts"
import { recoverTransactionAddress } from "viem"
import {
  mnemonic_to_seed,
  seed_to_master_key,
  derive_private_key,
  private_key_to_address,
  number_to_hex,
} from "./crypto"
import { sign_transaction } from "./sign-transaction"
import type { Hex } from "viem"
import { bytes_to_hex } from "./hex"
import {
  createReader,
  encodeChainId,
  http,
} from "@ethernauta/transport"
import { eip155_11155111 } from "@ethernauta/chain"

const NAMESPACE = {
  ETHEREUM: "eip155",
}
const ETHEREUM_SEPOLIA_RPC_URL =
  "https://little-bitter-wave.ethereum-sepolia.quiknode.pro/4d40a4c7ec139649d4b1f43f5d536c3756faacc9/"
const sepolia_chain_id = encodeChainId({
  namespace: NAMESPACE.ETHEREUM,
  reference: eip155_11155111.chainId,
})
const reader = createReader([
  {
    chainId: sepolia_chain_id,
    transports: [http(ETHEREUM_SEPOLIA_RPC_URL)],
  },
])

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

describe("transaction.ts", () => {
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

  it("should create hash with type prefix", () => {
    const type_prefix = new Uint8Array([0x02])
    const encoded_fields = new Uint8Array([0xc0]) // empty RLP list
    const result = make_transaction_hash(
      type_prefix,
      encoded_fields,
    )
    expect(result).toBeInstanceOf(Uint8Array)
    expect(result.length).toBe(32) // keccak256 output length
  })

  it("should sign hash with private key", () => {
    const hash = new Uint8Array(32).fill(0x01)
    const result = sign_transaction_hash(
      hash,
      TEST_PRIVATE_KEY,
    )
    expect(result).toHaveProperty("r")
    expect(result).toHaveProperty("s")
    expect(result).toHaveProperty("recovery")
  })

  it("should convert recovery ID to bigint", () => {
    const result = compose_y_parity(0)
    expect(result).toBe(0n)
  })

  it("should handle recovery ID 1", () => {
    const result = compose_y_parity(1)
    expect(result).toBe(1n)
  })

  it("should handle empty access list", () => {
    const result = encode_access_list([])
    expect(result).toEqual([])
  })

  it("should encode access list with one item", () => {
    const access_list = [
      {
        address:
          "0x742d35Cc6635C0532925a3b8D83C2D2d88Ca7c38" as const,
        storage_keys: [
          "0x0000000000000000000000000000000000000000000000000000000000000001",
        ],
      },
    ]
    const result = encode_access_list(access_list)
    expect(result).toHaveLength(1)
    expect(result[0]).toHaveLength(2) // [address, storage_keys]
  })

  it("should create 9 transaction fields", () => {
    const result = make_unsigned_fields(TEST_TRANSACTION)
    expect(result).toHaveLength(9)
    expect(result[0]).toBeInstanceOf(Uint8Array) // chain_id
    expect(result[8]).toEqual([]) // empty access_list
  })

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
  })

  it("should RLP encode field array", () => {
    const fields = [
      new Uint8Array([0x01]),
      new Uint8Array([0x02]),
    ]
    const result = encode_fields(fields)
    expect(result).toBeInstanceOf(Uint8Array)
    // should be equivalent to encode(fields)
    const expected = encode(fields)
    expect(result).toEqual(expected)
  })

  it("should produce valid EIP-1559 transaction", () => {
    const result = encode_eip155_transaction_unsigned(
      TEST_TRANSACTION,
      TEST_PRIVATE_KEY,
    )
    expect(result).toBeInstanceOf(Uint8Array)
    expect(result[0]).toBe(0x02) // should start with EIP-1559 type byte
    expect(result.length).toBeGreaterThan(100) // should be reasonably sized
  })

  it("should match Viem signed transaction", async () => {
    const test_mnemonic =
      "smile price bomb movie minimum treat hurdle adult wing come space cross"
    const seed = mnemonic_to_seed(test_mnemonic)
    const master_key = seed_to_master_key(seed)
    const private_key = derive_private_key(master_key)
    const private_key_hex = bytes_to_hex(private_key)
    const account = privateKeyToAccount(
      private_key_hex as Hex,
    )
    const viem_signed = await account.signTransaction({
      to: "0x515e9e0565fdddd4f8a9759744734154da453585",
      value: 1n,
      nonce: 0,
      gas: 21000n,
      chainId: sepolia.id,
      type: "eip1559",
      maxFeePerGas: 20000000000n,
      maxPriorityFeePerGas: 2000000000n,
    })
    const debug_transaction: Eip1559TransactionUnsigned = {
      to: "0x515e9e0565fdddd4f8a9759744734154da453585",
      data: new Uint8Array(),
      value: 1n,
      nonce: 0n,
      chain_id: 11155111n,
      gas_limit: 21000n,
      access_list: [],
      max_fee_per_gas: 20000000000n,
      max_priority_fee_per_gas: 2000000000n,
    }
    const debug_signed = encode_eip155_transaction_unsigned(
      debug_transaction,
      private_key,
    )
    expect(bytes_to_hex(debug_signed)).toBe(viem_signed)
  })

  it("should match Viem when signing transfer with dynamic params", async () => {
    const test_mnemonic =
      "smile price bomb movie minimum treat hurdle adult wing come space cross"
    const seed = mnemonic_to_seed(test_mnemonic)
    const master_key = seed_to_master_key(seed)
    const private_key = derive_private_key(master_key)
    const private_key_hex = bytes_to_hex(private_key)
    const address = private_key_to_address(private_key)
    const nonce = await get_nonce(
      address,
      reader,
      sepolia_chain_id,
    )
    const account = privateKeyToAccount(
      private_key_hex as Hex,
    )
    const method = "transfer"
    const TARGET_ADDRESS =
      "0x515e9e0565fdddd4f8a9759744734154da453585"
    const params = [TARGET_ADDRESS, number_to_hex(1)] // 1 wei
    const FIXED_GAS = 21000n
    const FIXED_MAX_FEE = 20000000000n
    const FIXED_PRIORITY_FEE = 2000000000n
    const viem_signed = await account.signTransaction({
      to: TARGET_ADDRESS,
      value: 1n, // 1 wei
      nonce: Number(nonce),
      gas: FIXED_GAS,
      chainId: sepolia.id,
      type: "eip1559",
      maxFeePerGas: FIXED_MAX_FEE,
      maxPriorityFeePerGas: FIXED_PRIORITY_FEE,
    })
    const key = new HDKey({ privateKey: private_key })
    const ethernauta_signed = await sign_transaction({
      key,
      nonce,
      method,
      params,
    })
    expect(bytes_to_hex(ethernauta_signed)).toBe(
      viem_signed,
    )
  })

  it("should recover correct sender address from signed transaction", async () => {
    const test_mnemonic =
      "smile price bomb movie minimum treat hurdle adult wing come space cross"
    const seed = mnemonic_to_seed(test_mnemonic)
    const master_key = seed_to_master_key(seed)
    const private_key = derive_private_key(master_key)
    const expected_address =
      private_key_to_address(private_key)

    const key = new HDKey({ privateKey: private_key })
    const method = "transfer"
    const TARGET_ADDRESS =
      "0x515e9e0565fdddd4f8a9759744734154da453585"
    const params = [TARGET_ADDRESS, number_to_hex(1)]

    const ethernauta_signed = await sign_transaction({
      key,
      nonce: 0n,
      method,
      params,
    })

    const signed_tx_hex = bytes_to_hex(
      ethernauta_signed,
    ) as Hex

    // Recover sender address from signed transaction
    const recovered_address =
      await recoverTransactionAddress({
        // @ts-expect-error minor type differnces
        serializedTransaction: signed_tx_hex,
      })

    console.log("Expected address:", expected_address)
    console.log("Recovered address:", recovered_address)

    expect(recovered_address.toLowerCase()).toBe(
      expected_address.toLowerCase(),
    )
  })

  it("should recover correct address from actual console log transaction", async () => {
    // This is the exact signed transaction from your console log
    const actual_signed_tx =
      "0x02f86e83aa36a78084773594008504a817c80082520894636c0fcd6da2207abfa80427b556695a4ad0af940180c001a0fa74e0e883841cf1919c0e5f93d819d62a30a49a1d501de04e2f52516b3083fda05ead6e9bc177a69962ec192130364d97ba7fc041cf2c74a0a3203c13136ddb47" as Hex

    const expected_address =
      "0x515e9e0565fdddd4f8a9759744734154da453585"

    const recovered_address =
      await recoverTransactionAddress({
        // @ts-expect-error minor type differnces
        serializedTransaction: actual_signed_tx,
      })

    console.log(
      "Console log transaction - Expected:",
      expected_address,
    )
    console.log(
      "Console log transaction - Recovered:",
      recovered_address,
    )

    expect(recovered_address.toLowerCase()).toBe(
      expected_address.toLowerCase(),
    )
  })
})
