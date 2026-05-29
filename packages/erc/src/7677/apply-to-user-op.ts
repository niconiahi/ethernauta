// https://eips.ethereum.org/EIPS/eip-7677
//
// Merge a paymaster response onto a `UserOperation`. The existing
// `@ethernauta/eip/4337` schema is v0.7 split-form only — the v0.6
// `paymasterAndData` packed wire shape has no representation
// there, so v0.6 responses raise a typed error pointing callers
// at the manual path. Composition stays clean: this helper hands
// a paymastered `UserOperation` back, and the caller pipes it
// into the existing `pack_user_operation` unchanged.

import type { UserOperation } from "@ethernauta/eip/4337"

import type {
  PaymasterData,
  PaymasterStubData,
} from "./paymaster"

export function apply_to_user_op(
  op: UserOperation,
  result: PaymasterStubData | PaymasterData,
): UserOperation {
  if ("paymasterAndData" in result) {
    throw new Error(
      "apply_to_user_op: ERC-7677 v0.6 response (paymasterAndData) cannot merge into the v0.7 UserOperation schema; unpack manually",
    )
  }
  return {
    ...op,
    paymaster: result.paymaster,
    paymasterData: result.paymasterData,
    paymasterVerificationGasLimit:
      "paymasterVerificationGasLimit" in result
        ? result.paymasterVerificationGasLimit
        : op.paymasterVerificationGasLimit,
    paymasterPostOpGasLimit:
      "paymasterPostOpGasLimit" in result
        ? result.paymasterPostOpGasLimit
        : op.paymasterPostOpGasLimit,
  }
}
