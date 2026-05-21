// https://eips.ethereum.org/EIPS/eip-4361
// SIWE message grammar — parse the well-known Sign-In With
// Ethereum textual form into structured fields. We accept the
// canonical layout produced by viem / siwe / wagmi; minor
// whitespace tolerance only.
//
// Returning `undefined` (rather than throwing) lets callers
// fall back to raw rendering — most personal_sign payloads
// are NOT SIWE messages.

import { addressSchema } from "@ethernauta/core"
import {
  array,
  type InferOutput,
  isoTimestamp,
  object,
  optional,
  pipe,
  safeParse,
  string,
} from "valibot"

export const siweMessageSchema = object({
  domain: string(),
  address: addressSchema,
  statement: optional(string()),
  uri: string(),
  version: string(),
  chainId: string(),
  nonce: string(),
  issuedAt: pipe(string(), isoTimestamp()),
  expirationTime: optional(pipe(string(), isoTimestamp())),
  notBefore: optional(pipe(string(), isoTimestamp())),
  requestId: optional(string()),
  resources: optional(array(string())),
})
export type SiweMessage = InferOutput<
  typeof siweMessageSchema
>

const HEADER_REGEX =
  /^(?<domain>[^\s]+) wants you to sign in with your Ethereum account:\n(?<address>0x[0-9a-fA-F]{40})\n\n/

const FIELDS = [
  ["URI", "uri"],
  ["Version", "version"],
  ["Chain ID", "chainId"],
  ["Nonce", "nonce"],
  ["Issued At", "issuedAt"],
  ["Expiration Time", "expirationTime"],
  ["Not Before", "notBefore"],
  ["Request ID", "requestId"],
] as const

function parse_fields(
  body: string,
): Record<string, string | string[]> {
  const lines = body.split("\n")
  const out: Record<string, string | string[]> = {}
  let i = 0
  while (i < lines.length) {
    const line = lines[i] ?? ""
    if (line === "Resources:") {
      const resources: string[] = []
      i += 1
      while (i < lines.length) {
        const item = lines[i] ?? ""
        if (!item.startsWith("- ")) break
        resources.push(item.slice(2))
        i += 1
      }
      out.resources = resources
      continue
    }
    for (const [label, key] of FIELDS) {
      const prefix = `${label}: `
      if (line.startsWith(prefix)) {
        out[key] = line.slice(prefix.length)
        break
      }
    }
    i += 1
  }
  return out
}

export function parse_siwe_message(
  raw: string,
): SiweMessage | undefined {
  const header = HEADER_REGEX.exec(raw)
  if (!header?.groups) return undefined
  const after_header = raw.slice(header[0].length)
  const sections = after_header.split("\n\n")
  const first = sections[0] ?? ""
  const statement =
    sections.length > 1 && first.trim() !== ""
      ? first
      : undefined
  const body =
    sections.length > 1
      ? sections.slice(1).join("\n\n")
      : after_header
  const fields = parse_fields(body)
  const candidate = {
    domain: header.groups.domain,
    address: header.groups.address,
    statement,
    ...fields,
  }
  const result = safeParse(siweMessageSchema, candidate)
  if (!result.success) return undefined
  return result.output
}

export function is_siwe_message(raw: string): boolean {
  return parse_siwe_message(raw) !== undefined
}
