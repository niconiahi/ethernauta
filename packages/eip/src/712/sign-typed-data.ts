// https://eips.ethereum.org/EIPS/eip-712 — wallet-side signing.
// Address is explicit (caller passes it). The wallet computes the
// EIP-712 digest internally and signs with the user's private key.

import type { Address, Bytes } from "@ethernauta/core"
import type {
  ResolvedSigner,
  Signable,
} from "@ethernauta/transport"
import { decode_chain_id } from "@ethernauta/transport"
import { parse } from "valibot"

import {
  type TypedData,
  typedDataSchema,
} from "./typed-data"

// Bigints survive `window.postMessage` (structured clone) but
// die at `chrome.runtime.sendMessage` and `chrome.storage`,
// both of which serialize via JSON. Normalise to hex strings
// before crossing into the wallet so callers can keep using
// bigints (the natural type for uint256 fields) without
// thinking about the boundary. The wallet re-parses via the
// same `typedDataSchema` which accepts hex/number/bigint.
function bigint_to_hex(value: bigint): `0x${string}` {
  return `0x${value.toString(16)}`
}

function normalize_bigints(value: unknown): unknown {
  if (typeof value === "bigint") return bigint_to_hex(value)
  if (Array.isArray(value))
    return value.map(normalize_bigints)
  if (value && typeof value === "object") {
    const out: Record<string, unknown> = {}
    for (const [k, v] of Object.entries(
      value as Record<string, unknown>,
    )) {
      out[k] = normalize_bigints(v)
    }
    return out
  }
  return value
}

function chain_id_to_bigint(
  value: bigint | number | `0x${string}`,
): bigint {
  if (typeof value === "bigint") return value
  if (typeof value === "number") return BigInt(value)
  return BigInt(value)
}

// https://eips.ethereum.org/EIPS/eip-712#specification
// Reject when the domain pins a chainId different from the
// one the signer is bound to — prevents cross-chain replay.
// `resolved_chain_id` is CAIP-2 (e.g. `eip155:1`); the domain
// uses the raw integer per the spec.
export function assert_domain_chain(
  typed_data: TypedData,
  resolved_chain_id: string,
): void {
  const domain_chain_id = typed_data.domain.chainId
  if (domain_chain_id === undefined) return
  const { reference } = decode_chain_id(resolved_chain_id)
  const domain_value = chain_id_to_bigint(domain_chain_id)
  const resolved_value = BigInt(reference)
  if (domain_value === resolved_value) return
  throw new Error(
    `eip-712 domain chainId ${domain_value} does not match active chain ${resolved_value}`,
  )
}

export function eth_signTypedData_v4(
  _parameters: [Address, TypedData],
): Signable<Bytes> {
  return async ([
    signer,
    context,
  ]: ResolvedSigner): Promise<Bytes> => {
    const [address, typed_data] = _parameters
    const validated = parse(typedDataSchema, typed_data)
    assert_domain_chain(validated, context.chain_id)
    const wire_safe = normalize_bigints(
      validated,
    ) as TypedData
    const signature = await signer("eth_signTypedData_v4", [
      address,
      wire_safe,
    ])
    return signature as Bytes
  }
}
