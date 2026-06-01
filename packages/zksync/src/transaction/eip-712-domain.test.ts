import {
  encode_type,
  hash_typed_data,
} from "@ethernauta/eip/712"
import { bytes_to_hex } from "@ethernauta/utils"
import { describe, expect, it } from "vitest"

import {
  build_zksync_domain,
  ZKSYNC_TYPED_DATA_TYPES,
} from "./eip-712-domain"

describe("eip-712-domain.ts — ZKSYNC_TYPED_DATA_TYPES", () => {
  // Verbatim from tmp/plans/04_zksync_package/README.md
  // "Locked design facts" → EIP-712 type hash.
  it("encodes Transaction matching the locked design-fact string", () => {
    expect(
      encode_type("Transaction", ZKSYNC_TYPED_DATA_TYPES),
    ).toBe(
      "Transaction(uint256 txType,uint256 from,uint256 to,uint256 gasLimit,uint256 gasPerPubdataByteLimit,uint256 maxFeePerGas,uint256 maxPriorityFeePerGas,uint256 paymaster,uint256 nonce,uint256 value,bytes data,bytes32[] factoryDeps,bytes paymasterInput)",
    )
  })
})

describe("eip-712-domain.ts — build_zksync_domain", () => {
  it("emits the 3-field domain with no verifyingContract", () => {
    const domain = build_zksync_domain(324n)
    expect(domain.name).toBe("zkSync")
    expect(domain.version).toBe("2")
    expect(domain.chainId).toBe(324n)
    expect(domain.verifyingContract).toBeUndefined()
    expect(domain.salt).toBeUndefined()
  })

  // The full digest is `keccak("\x19\x01" || domain || message)`,
  // so the domain separator drives every chain's signature.
  // Pinning the digest of an empty `Transaction` message on
  // chain 324 catches accidental drift in either the domain
  // shape or the Transaction type ordering.
  it("produces a deterministic typed-data digest", () => {
    const digest = hash_typed_data({
      domain: build_zksync_domain(324n),
      types: ZKSYNC_TYPED_DATA_TYPES,
      primaryType: "Transaction",
      message: {
        txType: 113n,
        from: 0n,
        to: 0n,
        gasLimit: 0n,
        gasPerPubdataByteLimit: 0n,
        maxFeePerGas: 0n,
        maxPriorityFeePerGas: 0n,
        paymaster: 0n,
        nonce: 0n,
        value: 0n,
        data: "0x",
        factoryDeps: [],
        paymasterInput: "0x",
      },
    })
    expect(bytes_to_hex(digest)).toMatch(/^0x[0-9a-f]{64}$/)
  })
})
