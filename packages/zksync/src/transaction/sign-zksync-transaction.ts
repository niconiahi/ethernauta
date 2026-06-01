// https://docs.zksync.io/zksync-protocol/rollup/transaction-lifecycle#eip-712-0x71-transactions
// Path-2 (no-wallet) primitive: take a zkSync 0x71 transaction
// request plus a local secp256k1 private key, return the raw
// signed envelope ready for `eth_sendRawTransaction`. The
// path-1 (wallet-routed) flow lands in a future wallet phase;
// the encoder here is the piece the wallet will sit on top of.

import { sign_digest } from "@ethernauta/crypto"

import {
  encode_zksync_transaction,
  hash_zksync_transaction,
  type ZksyncTransactionRequest,
} from "./encode-zksync-transaction"

export function sign_zksync_transaction(
  request: ZksyncTransactionRequest,
  private_key: Uint8Array,
): Uint8Array {
  const digest = hash_zksync_transaction(request)
  const signature = sign_digest(digest, private_key)
  return encode_zksync_transaction(request, {
    r: signature.r,
    s: signature.s,
    recovery: signature.recovery,
  })
}
