// https://eips.ethereum.org/EIPS/eip-7702
//
// Delegation designator: once an EOA has authorized a delegate
// via a type-4 transaction, `eth_getCode` at the EOA returns
//
//   0xef0100 || <20-byte delegate address>
//
// The account is still an EOA — its private key still signs.
// Code consumers (signature verifiers, ABI-call routers) that
// branch on "has code → contract" must special-case this prefix.

import type { Bytes } from "@ethernauta/core"

const DELEGATION_DESIGNATOR_PREFIX = "0xef0100"
const DELEGATION_DESIGNATOR_LENGTH =
  DELEGATION_DESIGNATOR_PREFIX.length + 40

export function is_delegation_designator(code: Bytes): boolean {
  return (
    code.length === DELEGATION_DESIGNATOR_LENGTH &&
    code.startsWith(DELEGATION_DESIGNATOR_PREFIX)
  )
}
