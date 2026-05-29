// https://eips.ethereum.org/EIPS/eip-5267
//
// `eip712Domain() returns (
//   bytes1 fields, string name, string version,
//   uint256 chainId, address verifyingContract,
//   bytes32 salt, uint256[] extensions
// )`
//
// The `fields` bitmap tells consumers which of the five EIP-712
// domain members are *actually* part of the contract's domain
// separator. We drop the un-set members from the returned
// object so that hashing against the result reproduces the
// contract's domain hash byte-for-byte. The `extensions` array
// (additional EIP numbers that extend the domain definition)
// is not part of the EIP-712 domain itself — we return it
// alongside so the caller can branch on it if needed.

import {
  address,
  array,
  bytes1,
  bytes32,
  decode_function_result,
  encode_function_call,
  string_,
  uint256,
} from "@ethernauta/abi"
import { type Bytes, BytesSchema } from "@ethernauta/core"
import type {
  Callable,
  ContractContext,
} from "@ethernauta/transport"
import { bytes_to_hex } from "@ethernauta/utils"
import { type InferOutput, array as v_array, object, parse } from "valibot"

import {
  type TypedDataDomain,
  TypedDataDomainSchema,
} from "../712/typed-data"
import { decode_fields } from "./fields"

const OUTPUT_CODECS = [
  bytes1(),
  string_(),
  string_(),
  uint256(),
  address(),
  bytes32(),
  array(uint256()),
] as const

export const DomainResultSchema = object({
  domain: TypedDataDomainSchema,
  extensions: v_array(uint256().schema),
})
export type DomainResult = InferOutput<
  typeof DomainResultSchema
>

export function get_domain(): (
  context: ContractContext,
) => Callable<DomainResult> {
  return (context: ContractContext): Callable<DomainResult> => {
    const calldata = encode_function_call({
      name: "eip712Domain",
      args: [] as const,
      values: [] as const,
    })
    return {
      chain_id: context.chain_id,
      to: context.to,
      data: parse(BytesSchema, bytes_to_hex(calldata)),
      decode: (result: Bytes): DomainResult => {
        const [
          fields_byte,
          name,
          version,
          chain_id,
          verifying_contract,
          salt,
          extensions,
        ] = decode_function_result(OUTPUT_CODECS, result)
        const fields = decode_fields(fields_byte)
        const domain: TypedDataDomain = {}
        if (fields.name) domain.name = name
        if (fields.version) domain.version = version
        if (fields.chainId) domain.chainId = chain_id
        if (fields.verifyingContract) {
          domain.verifyingContract = verifying_contract
        }
        if (fields.salt) domain.salt = salt
        return parse(DomainResultSchema, {
          domain,
          extensions,
        })
      },
    }
  }
}

