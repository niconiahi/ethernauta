// https://eips.ethereum.org/EIPS/eip-712 — wallet-side signing.
// Address is explicit (caller passes it). The wallet computes the
// EIP-712 digest internally and signs with the user's private key.

import type { Address, Bytes } from "@ethernauta/core"
import type {
  ResolvedSigner,
  Signable,
} from "@ethernauta/transport"
import { parse } from "valibot"

import { type TypedData, typedDataSchema } from "./typed-data"

export function eth_signTypedData_v4(
  _parameters: [Address, TypedData],
): Signable<Bytes> {
  return async ([
    signer,
    _context,
  ]: ResolvedSigner): Promise<Bytes> => {
    const [address, typed_data] = _parameters
    const validated = parse(typedDataSchema, typed_data)
    const signature = await signer(
      "eth_signTypedData_v4",
      [address, validated],
    )
    return signature as Bytes
  }
}
