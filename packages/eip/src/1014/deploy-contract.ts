// https://eips.ethereum.org/EIPS/eip-1014
import {
  type AbiCodec,
  encode_constructor_call,
} from "@ethernauta/abi"
import { type Bytes, bytesSchema } from "@ethernauta/core"
import type {
  ResolvedSigner,
  Signable,
} from "@ethernauta/transport"
import {
  bytes_to_hex,
  hex_to_bytes,
} from "@ethernauta/utils"
import { parse } from "valibot"

type ValuesOf<Args extends readonly AbiCodec<unknown>[]> = {
  [K in keyof Args]: Args[K] extends AbiCodec<infer T>
    ? T
    : never
}

// Deploy-time creation calldata is `bytecode ‖ abi(constructor_args)`.
// The wallet fills nonce / gas / fees per the project invariant — the
// caller must NOT set them. Omitting `to` is the contract for a
// creation transaction.
//
// Returns the signed raw transaction (the codebase's `Signable<T>`
// convention is to return what the signer produces — broadcast with
// `eth_sendRawTransaction` separately to obtain the tx hash, then
// resolve the deployed address with `get_contract_address` /
// `get_create2_address`).
export function deploy_contract<
  Args extends readonly AbiCodec<unknown>[],
>(_parameters: {
  bytecode: Bytes
  args: Args
  values: ValuesOf<Args>
}): Signable<Bytes> {
  return async ([signer, _context]: ResolvedSigner) => {
    const bytecode = hex_to_bytes(
      parse(bytesSchema, _parameters.bytecode),
    )
    const calldata = encode_constructor_call({
      bytecode,
      args: _parameters.args,
      values: _parameters.values,
    })
    const signed = await signer("eth_signTransaction", [
      {
        value: "0x0",
        input: bytes_to_hex(calldata),
      },
    ])
    return parse(bytesSchema, signed)
  }
}
