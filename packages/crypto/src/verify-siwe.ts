// https://eips.ethereum.org/EIPS/eip-4361
//
// Full SIWE verification: parse the canonical message,
// enforce the SIWE-specific semantics (domain, nonce, uri,
// chainId, address, issuedAt / expirationTime / notBefore)
// against caller-supplied expectations, then delegate the
// cryptographic check to either `@ethernauta/eip/1271`
// (EOA fast-path + deployed contract account) or, when the
// signature carries the 6492 wrap, `@ethernauta/eip/6492`
// (counterfactual contract account — runs the deploy
// factory inline via the universal validator). The branch
// is based purely on whether the signature is wrapped, so
// EOAs never pay an `eth_call`.
//
// Returns a discriminated result so the caller can surface
// a precise failure reason — most playground / dapp flows
// want to tell the user *why* the sign-in failed, not just
// "invalid".

import {
  addressSchema,
  bytesSchema,
} from "@ethernauta/core"
import type {
  Readable,
  ResolvedReader,
} from "@ethernauta/transport"
import {
  date,
  type InferOutput,
  object,
  optional,
  parse,
  string,
} from "valibot"

import { is_wrapped_signature } from "@ethernauta/eip/6492"
import {
  parse_siwe_message,
  type SiweMessage,
} from "@ethernauta/eip/4361"

import { verify_message_1271 } from "./verify-message-1271"
import { verify_message_6492 } from "./verify-message-6492"

export const verifySiweMessageParametersSchema = object({
  message: string(),
  signature: bytesSchema,
  expected: object({
    domain: string(),
    nonce: string(),
    address: optional(addressSchema),
    chainId: optional(string()),
    uri: optional(string()),
  }),
  now: optional(date()),
})
export type VerifySiweMessageParameters = InferOutput<
  typeof verifySiweMessageParametersSchema
>

export type VerifySiweMessageResult =
  | { ok: true; fields: SiweMessage }
  | { ok: false; reason: VerifySiweMessageFailureReason }

export type VerifySiweMessageFailureReason =
  | "malformed_message"
  | "domain_mismatch"
  | "nonce_mismatch"
  | "uri_mismatch"
  | "chain_id_mismatch"
  | "address_mismatch"
  | "issued_in_future"
  | "expired"
  | "not_yet_valid"
  | "invalid_signature"

// One minute of leeway for issuedAt to absorb clock skew
// between the signer's machine and the verifier.
const CLOCK_SKEW_MS = 60_000

export function verify_siwe_message(
  _parameters: VerifySiweMessageParameters,
): Readable<VerifySiweMessageResult> {
  return async (
    resolved: ResolvedReader,
  ): Promise<VerifySiweMessageResult> => {
    const parameters = parse(
      verifySiweMessageParametersSchema,
      _parameters,
    )
    const fields = parse_siwe_message(parameters.message)
    if (!fields) {
      return { ok: false, reason: "malformed_message" }
    }
    if (fields.domain !== parameters.expected.domain) {
      return { ok: false, reason: "domain_mismatch" }
    }
    if (fields.nonce !== parameters.expected.nonce) {
      return { ok: false, reason: "nonce_mismatch" }
    }
    if (
      parameters.expected.uri !== undefined &&
      fields.uri !== parameters.expected.uri
    ) {
      return { ok: false, reason: "uri_mismatch" }
    }
    if (
      parameters.expected.chainId !== undefined &&
      fields.chainId !== parameters.expected.chainId
    ) {
      return { ok: false, reason: "chain_id_mismatch" }
    }
    if (
      parameters.expected.address !== undefined &&
      fields.address.toLowerCase() !==
        parameters.expected.address.toLowerCase()
    ) {
      return { ok: false, reason: "address_mismatch" }
    }
    const now = parameters.now ?? new Date()
    if (
      new Date(fields.issuedAt).getTime() >
      now.getTime() + CLOCK_SKEW_MS
    ) {
      return { ok: false, reason: "issued_in_future" }
    }
    if (fields.expirationTime !== undefined) {
      if (
        new Date(fields.expirationTime).getTime() <=
        now.getTime()
      ) {
        return { ok: false, reason: "expired" }
      }
    }
    if (fields.notBefore !== undefined) {
      if (
        new Date(fields.notBefore).getTime() > now.getTime()
      ) {
        return { ok: false, reason: "not_yet_valid" }
      }
    }
    const verify = is_wrapped_signature(
      parameters.signature,
    )
      ? verify_message_6492
      : verify_message_1271
    const valid = await verify({
      address: fields.address,
      message: parameters.message,
      signature: parameters.signature,
    })(resolved)
    if (!valid) {
      return { ok: false, reason: "invalid_signature" }
    }
    return { ok: true, fields }
  }
}
