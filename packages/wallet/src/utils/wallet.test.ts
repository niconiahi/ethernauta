import "fake-indexeddb/auto"
import {
  array,
  custom,
  type InferOutput,
  number,
  object,
  parse,
  record,
  string,
  unknown,
} from "valibot"
import {
  beforeEach,
  describe,
  expect,
  it,
  vi,
} from "vitest"

import { delete_vault, set_vault } from "./vault"
import {
  accounts,
  active_account,
  add_account,
  get_accounts,
  get_active_account,
  init_accounts,
  master_unlocked,
  restore_accounts,
  set_active_index,
} from "./wallet"

const TEST_MNEMONIC =
  "abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon about"
const TEST_PASSWORD = "test123"

// BIP-44 / EIP-155 expected addresses for the all-zeros test
// mnemonic at path m/44'/60'/0'/0/<index>. These are the
// industry-standard reference vectors used across MetaMask,
// ethers, viem.
const EXPECTED_ADDRESSES = [
  "0x9858effd232b4033e47d90003d41ec34ecaeda94",
  "0x6fac4d18c912343bf86fa7049364dd4e424ab9c0",
  "0xb6716976a3ebe8d39aceb04372f22ff8e6802d7a",
] as const

function reset_accounts_signal() {
  accounts.value = {
    list: [],
    active_index: 0,
    master: null,
  }
}

const chromeStubSchema = object({
  store: record(string(), unknown()),
  send_message: custom<ReturnType<typeof vi.fn>>(
    (value) => typeof value === "function",
  ),
})
type ChromeStub = InferOutput<typeof chromeStubSchema>

function stub_chrome(): ChromeStub {
  const store: Record<string, unknown> = {}
  const send_message = vi.fn(async () => undefined)
  vi.stubGlobal("chrome", {
    storage: {
      local: {
        get: vi.fn(async (key: string) => {
          if (key in store) return { [key]: store[key] }
          return {}
        }),
        set: vi.fn(
          async (entries: Record<string, unknown>) => {
            Object.assign(store, entries)
          },
        ),
        remove: vi.fn(async (key: string) => {
          delete store[key]
        }),
      },
    },
    runtime: {
      sendMessage: send_message,
    },
  })
  return { store, send_message }
}

function stub_chrome_storage(): Record<string, unknown> {
  return stub_chrome().store
}

beforeEach(async () => {
  vi.unstubAllGlobals()
  await delete_vault().catch(() => {})
  reset_accounts_signal()
})

describe("init_accounts (first login)", () => {
  it("derives account 0 at the BIP-44 path and persists it", async () => {
    const store = stub_chrome_storage()
    await set_vault(TEST_MNEMONIC, TEST_PASSWORD)
    await init_accounts(TEST_PASSWORD)

    const list = get_accounts()
    expect(list).toHaveLength(1)
    expect(list[0]?.index).toBe(0)
    expect(list[0]?.address.toLowerCase()).toBe(
      EXPECTED_ADDRESSES[0],
    )
    expect(accounts.value.active_index).toBe(0)
    expect(master_unlocked()).toBe(true)
    const persisted = parse(
      object({
        list: array(object({ index: number(), address: string() })),
      }),
      store.accounts,
    )
    expect(persisted.list).toHaveLength(1)
    expect(persisted.list[0]?.index).toBe(0)
  })
})

describe("init_accounts (subsequent login)", () => {
  it("keeps the existing list and unlocks the master", async () => {
    stub_chrome_storage()
    await set_vault(TEST_MNEMONIC, TEST_PASSWORD)
    await init_accounts(TEST_PASSWORD)
    await add_account()
    await set_active_index(1)
    // Simulate a popup restart — list stays in storage, in-memory
    // master is gone, then restore loads list, init re-unlocks.
    accounts.value = { ...accounts.value, master: null }
    expect(master_unlocked()).toBe(false)
    await restore_accounts()
    expect(get_accounts()).toHaveLength(2)
    expect(accounts.value.active_index).toBe(1)
    expect(master_unlocked()).toBe(false)
    await init_accounts(TEST_PASSWORD)
    expect(get_accounts()).toHaveLength(2)
    expect(accounts.value.active_index).toBe(1)
    expect(master_unlocked()).toBe(true)
  })
})

describe("add_account", () => {
  it("derives the next free index", async () => {
    stub_chrome_storage()
    await set_vault(TEST_MNEMONIC, TEST_PASSWORD)
    await init_accounts(TEST_PASSWORD)

    const next = await add_account()
    expect(next.index).toBe(1)
    expect(next.address.toLowerCase()).toBe(
      EXPECTED_ADDRESSES[1],
    )

    const third = await add_account()
    expect(third.index).toBe(2)
    expect(third.address.toLowerCase()).toBe(
      EXPECTED_ADDRESSES[2],
    )
    expect(get_accounts()).toHaveLength(3)
  })

  it("throws when the master is not unlocked", async () => {
    stub_chrome_storage()
    await set_vault(TEST_MNEMONIC, TEST_PASSWORD)
    await init_accounts(TEST_PASSWORD)
    accounts.value = { ...accounts.value, master: null }

    await expect(add_account()).rejects.toThrow(
      /master key must be unlocked/i,
    )
  })

  it("fills holes if an intermediate index were missing", async () => {
    // Stress: simulate the storage having indices 0 and 2.
    // next_free_index should return 1.
    stub_chrome_storage()
    await set_vault(TEST_MNEMONIC, TEST_PASSWORD)
    await init_accounts(TEST_PASSWORD)
    await add_account() // index 1
    await add_account() // index 2
    accounts.value = {
      ...accounts.value,
      list: accounts.value.list.filter(
        (a) => a.index !== 1,
      ),
    }
    const filled = await add_account()
    expect(filled.index).toBe(1)
  })
})

describe("set_active_index", () => {
  it("switches the active account", async () => {
    stub_chrome_storage()
    await set_vault(TEST_MNEMONIC, TEST_PASSWORD)
    await init_accounts(TEST_PASSWORD)
    await add_account()

    expect(get_active_account().index).toBe(0)
    await set_active_index(1)
    expect(get_active_account().index).toBe(1)
    expect(get_active_account().address.toLowerCase()).toBe(
      EXPECTED_ADDRESSES[1],
    )
  })

  it("throws when activating an index that's not in the list", async () => {
    stub_chrome_storage()
    await set_vault(TEST_MNEMONIC, TEST_PASSWORD)
    await init_accounts(TEST_PASSWORD)
    await expect(set_active_index(5)).rejects.toThrow(
      /not in account list/i,
    )
  })
})

describe("active_account (computed)", () => {
  it("tracks the active_index reactively", async () => {
    stub_chrome_storage()
    await set_vault(TEST_MNEMONIC, TEST_PASSWORD)
    await init_accounts(TEST_PASSWORD)
    await add_account()
    await add_account()

    expect(active_account.value.index).toBe(0)
    await set_active_index(2)
    expect(active_account.value.index).toBe(2)
    expect(active_account.value.address.toLowerCase()).toBe(
      EXPECTED_ADDRESSES[2],
    )
  })

  it("returns an empty placeholder before any init", () => {
    stub_chrome_storage()
    expect(active_account.value.address).toBe("")
    expect(active_account.value.index).toBe(0)
  })
})

describe("set_active_index broadcast", () => {
  it("sends an accounts-changed notification with the new active address", async () => {
    const { send_message } = stub_chrome()
    await set_vault(TEST_MNEMONIC, TEST_PASSWORD)
    await init_accounts(TEST_PASSWORD)
    await add_account()
    send_message.mockClear()

    await set_active_index(1)

    expect(send_message).toHaveBeenCalledTimes(1)
    const [payload] = send_message.mock.calls[0] ?? []
    expect(payload).toEqual({
      type: "ETHERNAUTA_NOTIFICATION_ACCOUNTS_CHANGED",
      accounts: [EXPECTED_ADDRESSES[1]],
    })
  })

  it("does not broadcast when add_account runs (no active change)", async () => {
    const { send_message } = stub_chrome()
    await set_vault(TEST_MNEMONIC, TEST_PASSWORD)
    await init_accounts(TEST_PASSWORD)
    send_message.mockClear()

    await add_account()

    expect(send_message).not.toHaveBeenCalled()
  })
})

describe("restore_accounts round-trip", () => {
  it("loads the persisted list back from storage", async () => {
    stub_chrome_storage()
    await set_vault(TEST_MNEMONIC, TEST_PASSWORD)
    await init_accounts(TEST_PASSWORD)
    await add_account()
    await set_active_index(1)
    const previous_addresses = get_accounts().map(
      (a) => a.address,
    )

    // Simulate a fresh popup process.
    reset_accounts_signal()
    await restore_accounts()

    expect(get_accounts().map((a) => a.address)).toEqual(
      previous_addresses,
    )
    expect(accounts.value.active_index).toBe(1)
    expect(master_unlocked()).toBe(false)
  })

  it("is a no-op when storage is empty", async () => {
    stub_chrome_storage()
    await restore_accounts()
    expect(get_accounts()).toHaveLength(0)
  })
})
