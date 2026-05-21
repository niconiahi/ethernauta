// https://eips.ethereum.org/EIPS/eip-4361
//
// Render a structured `SiweMessage` into the canonical
// textual form a wallet will sign via `personal_sign`. The
// output is byte-for-byte the inverse of `parse_siwe_message`
// for any message produced here.

import { parse } from "valibot"

import {
  type SiweMessage,
  siweMessageSchema,
} from "./parse"

const FIELDS = [
  ["uri", "URI"],
  ["version", "Version"],
  ["chainId", "Chain ID"],
  ["nonce", "Nonce"],
  ["issuedAt", "Issued At"],
  ["expirationTime", "Expiration Time"],
  ["notBefore", "Not Before"],
  ["requestId", "Request ID"],
] as const

export function build_siwe_message(
  _fields: SiweMessage,
): string {
  const fields = parse(siweMessageSchema, _fields)
  const lines: string[] = []
  lines.push(
    `${fields.domain} wants you to sign in with your Ethereum account:`,
  )
  lines.push(fields.address)
  lines.push("")
  if (fields.statement !== undefined) {
    lines.push(fields.statement)
    lines.push("")
  }
  for (const [key, label] of FIELDS) {
    const value = fields[key]
    if (value === undefined) continue
    lines.push(`${label}: ${value}`)
  }
  if (fields.resources && fields.resources.length > 0) {
    lines.push("Resources:")
    for (const resource of fields.resources) {
      lines.push(`- ${resource}`)
    }
  }
  return lines.join("\n")
}
