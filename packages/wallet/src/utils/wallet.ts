import { invariant } from "@ethernauta/utils"
import { computed, signal } from "@preact/signals"
import { HDKey } from "@scure/bip32"
import {
  array,
  type InferOutput,
  number,
  object,
  optional,
  parse,
  string,
} from "valibot"
import {
  mnemonic_to_seed,
  private_key_to_address,
  seed_to_master_key,
} from "./crypto"
import { get_vault } from "./vault"

const ACCOUNT_PATH = "m/44'/60'/0'/0"

const StorableAccountSchema = object({
  index: number(),
  address: string(),
  xpriv: string(),
})

const StorableAccountsSchema = object({
  list: array(StorableAccountSchema),
  active_index: number(),
})
type StorableAccounts = InferOutput<
  typeof StorableAccountsSchema
>

export type Account = {
  index: number
  address: string
  key: HDKey
}

type AccountsState = {
  list: Account[]
  active_index: number
  master: HDKey | null
}

const EMPTY_KEY = new HDKey({
  privateKey: new Uint8Array(32).fill(1),
})

const EMPTY_ACCOUNT: Account = {
  index: 0,
  address: "",
  key: EMPTY_KEY,
}

export const accounts = signal<AccountsState>({
  list: [],
  active_index: 0,
  master: null,
})

export const active_account = computed<Account>(() => {
  const state = accounts.value
  return (
    state.list.find(
      (account) => account.index === state.active_index,
    ) ?? EMPTY_ACCOUNT
  )
})

export function get_accounts(): Account[] {
  return accounts.value.list
}

export function get_active_account(): Account {
  return active_account.value
}

function derive_at(master: HDKey, index: number): Account {
  const key = master.derive(`${ACCOUNT_PATH}/${index}`)
  const private_key = key.privateKey
  invariant(
    private_key,
    "derived account must have a private key",
  )
  const address = private_key_to_address(private_key)
  return { index, address, key }
}

async function persist_accounts(state: AccountsState) {
  const storable: StorableAccounts = {
    list: state.list.map((account) => ({
      index: account.index,
      address: account.address,
      xpriv: account.key.toJSON().xpriv,
    })),
    active_index: state.active_index,
  }
  await chrome.storage.local.set({ accounts: storable })
}

export async function restore_accounts(): Promise<void> {
  const storage = parse(
    object({
      accounts: optional(StorableAccountsSchema),
    }),
    await chrome.storage.local.get("accounts"),
  )
  const stored = storage.accounts
  if (!stored) return
  accounts.value = {
    list: stored.list.map((entry) => ({
      index: entry.index,
      address: entry.address,
      key: HDKey.fromExtendedKey(entry.xpriv),
    })),
    active_index: stored.active_index,
    master: null,
  }
}

// Login flow. Decrypts the vault, caches the master in
// memory for the popup session. If no accounts are stored
// yet (first login), derives account 0 and persists it.
// Otherwise the existing list (loaded by `restore_accounts`)
// is kept as-is — the master is added so `add_account` works.
export async function init_accounts(
  password: string,
): Promise<void> {
  const mnemonic = await get_vault(password)
  invariant(mnemonic, "vault should exist to sign in")
  const seed = mnemonic_to_seed(mnemonic)
  const master = seed_to_master_key(seed)
  const current = accounts.value
  if (current.list.length === 0) {
    const account_0 = derive_at(master, 0)
    const next: AccountsState = {
      list: [account_0],
      active_index: 0,
      master,
    }
    accounts.value = next
    await persist_accounts(next)
    return
  }
  accounts.value = { ...current, master }
}

export function master_unlocked(): boolean {
  return accounts.value.master !== null
}

// Derive the next free index. Requires the master to be in
// memory — `init_accounts` caches it at login time.
export async function add_account(): Promise<Account> {
  const state = accounts.value
  invariant(
    state.master,
    "master key must be unlocked to add an account",
  )
  const next_index = next_free_index(state.list)
  const account = derive_at(state.master, next_index)
  const next: AccountsState = {
    ...state,
    list: [...state.list, account],
  }
  accounts.value = next
  await persist_accounts(next)
  return account
}

export async function set_active_index(
  index: number,
): Promise<void> {
  const state = accounts.value
  const account = state.list.find((a) => a.index === index)
  invariant(
    account,
    `cannot activate index ${index}: not in account list`,
  )
  const next: AccountsState = {
    ...state,
    active_index: index,
  }
  accounts.value = next
  await persist_accounts(next)
  broadcast_accounts_changed([account.address])
}

function broadcast_accounts_changed(
  addresses: string[],
): void {
  // Best-effort fire-and-forget — chrome.runtime is absent in
  // test environments, so guard it. The background script
  // relays the notification to all tabs via
  // chrome.tabs.sendMessage; the content script and provider
  // adapter pick it up from there.
  if (typeof chrome === "undefined") return
  if (!chrome.runtime?.sendMessage) return
  chrome.runtime
    .sendMessage({
      type: "ETHERNAUTA_NOTIFICATION_ACCOUNTS_CHANGED",
      accounts: addresses,
    })
    .catch(() => {})
}

function next_free_index(list: Account[]): number {
  const used = new Set(list.map((a) => a.index))
  let i = 0
  while (used.has(i)) i++
  return i
}
