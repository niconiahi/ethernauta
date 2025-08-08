import { signal } from "@preact/signals"
import { HDKey } from "@scure/bip32"
import { get_vault } from "./vault"
import invariant from "./tiny-invariant"
import {
  derive_private_key,
  mnemonic_to_seed,
  private_key_to_address,
  seed_to_master_key,
} from "./crypto"
import {
  instance,
  object,
  optional,
  parse,
  string,
  type InferOutput,
} from "valibot"

const StorableWalletSchema = object({
  address: string(),
  private_key: string(),
})
type StorableWallet = InferOutput<
  typeof StorableWalletSchema
>

const WalletSchema = object({
  address: string(),
  key: instance(HDKey),
})
type Wallet = InferOutput<typeof WalletSchema>

export const wallet = signal<Wallet>({
  address: "",
  key: new HDKey({
    privateKey: new Uint8Array(32).fill(1),
  }),
})

export function get_wallet() {
  return wallet.value
}

export async function save_wallet(wallet: Wallet) {
  const storable_wallet: StorableWallet = {
    address: wallet.address,
    private_key: wallet.key.toJSON().xpriv,
  }
  await chrome.storage.sync.set({ wallet: storable_wallet })
}

export async function restore_wallet() {
  const storage = parse(
    object({
      wallet: optional(StorableWalletSchema),
    }),
    await chrome.storage.sync.get("wallet"),
  )
  const stored_wallet = storage.wallet
  if (stored_wallet) {
    wallet.value = {
      address: stored_wallet.address,
      key: HDKey.fromExtendedKey(stored_wallet.private_key),
    }
  }
}

export async function set_wallet(password: string) {
  const vault = await get_vault(password)
  invariant(vault, "vault should exist to sign in")
  const seed = mnemonic_to_seed(vault)
  const master_key = seed_to_master_key(seed)
  const child_private_key = derive_private_key(master_key)
  const address = private_key_to_address(child_private_key)
  const child_key = master_key.derive("m/44'/60'/0'/0/0")
  const next_wallet: Wallet = {
    address,
    key: child_key,
  }
  wallet.value = next_wallet
  save_wallet(next_wallet)
}
