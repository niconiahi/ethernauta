// https://eips.ethereum.org/EIPS/eip-4337
//
// Sign a UserOperation by computing its userOpHash and
// asking the wallet to personal_sign it. SimpleAccount and
// other accounts that use OpenZeppelin's `ECDSA.recover` on
// the EIP-191-prefixed digest are compatible with this
// path. Accounts that recover from the raw userOpHash
// without prefix need a different signer.

import type { Address, Bytes, Uint } from "@ethernauta/core"
import type { Signable } from "@ethernauta/transport"

import { personal_sign } from "../191/method/personal_sign"
import { get_user_op_hash } from "./user-op-hash"
import type { UserOperation } from "./types"

export function sign_user_op({
  op,
  owner,
  entryPoint,
  chainId,
}: {
  op: UserOperation
  owner: Address
  entryPoint: Address
  chainId: Uint | bigint
}): Signable<Bytes> {
  const user_op_hash = get_user_op_hash({
    op,
    entryPoint,
    chainId,
  })
  return personal_sign([user_op_hash, owner])
}
