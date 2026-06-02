import { AddressesSchema } from "@ethernauta/core"
import {
  create_provider,
  type Provider,
  type RequestArguments,
} from "@ethernauta/eip/1193"
import { announce } from "@ethernauta/eip/6963"
import { CallSchema, http } from "@ethernauta/transport"
import { parse, safeParse } from "valibot"
import icon from "../public/icons/icon-128.png?inline"
import {
  type Chain,
  find_chain,
  to_provider_chain_id,
} from "../src/utils/chain"
import {
  compose_calls_status,
  compose_capabilities,
} from "../src/utils/calls-status"
import { create_router } from "../src/utils/dispatch"
import {
  make_request,
  RpcNotificationSchema,
  RpcResponseSchema,
} from "../src/utils/event"

// This module is injected into the page context by
// browser.entry.ts, so it has *no* access to chrome.* APIs
// (no chrome.storage, no chrome.runtime listeners).
// Everything that needs the extension API runs in the
// content script (browser.entry.ts), which sends us the
// resolved chain via window.postMessage. We just hold the
// active chain in memory, look it up against the bundled
// registry on chain-change, and emit chainChanged when it
// flips.
const MAINNET: Chain = {
  id: 1,
  name: "Ethereum Mainnet",
  rpc_url: "https://ethereum-rpc.publicnode.com",
}
let active_chain: Chain = MAINNET
let active_chain_id: string = to_provider_chain_id(MAINNET)
let accounts: string[] = []

async function apply_chain_id_hex(
  chain_id_hex: string,
): Promise<void> {
  const numeric = Number.parseInt(chain_id_hex.slice(2), 16)
  const resolved = await find_chain(numeric)
  if (!resolved) return
  const next_hex = to_provider_chain_id(resolved)
  const changed = next_hex !== active_chain_id
  active_chain = resolved
  active_chain_id = next_hex
  if (changed) provider.emit("chainChanged", next_hex)
}

function set_accounts(next: string[]): void {
  const changed =
    next.length !== accounts.length ||
    next.some((a, i) => a !== accounts[i])
  accounts = next
  if (changed) provider.emit("accountsChanged", next)
}

function get_permissions(): Array<{
  parentCapability: string
  caveats: Array<{ type: string; value: unknown }>
}> {
  // https://eips.ethereum.org/EIPS/eip-2255
  if (accounts.length === 0) return []
  return [
    {
      parentCapability: "eth_accounts",
      caveats: [
        {
          type: "restrictReturnedAccounts",
          value: accounts,
        },
      ],
    },
  ]
}

async function rpc_call(
  _chain_id_hex: string,
  method: string,
  params: unknown,
): Promise<unknown> {
  const transport = http(active_chain.rpc_url)
  const call = parse(CallSchema, [method, params ?? []])
  const response = await transport(call)
  if ("error" in response) {
    throw {
      code: response.error.code,
      message: response.error.message,
      data: response.error.data,
    }
  }
  return response.result
}

// Post a JSON-RPC request onto the bus and resolve the
// promise on the matching response. JSON-RPC 2.0 makes this
// uniform: success → `result`, failure → `error` with code +
// message. EIP-1193's `request` rejection contract maps
// directly to the JSON-RPC error shape — no per-method
// special-casing.
function postmessage_and_wait(
  args: RequestArguments,
): Promise<unknown> {
  return new Promise((resolve, reject) => {
    const id = crypto.randomUUID()
    window.addEventListener(
      "message",
      function handler(event) {
        const parsed = safeParse(
          RpcResponseSchema,
          event.data,
        )
        if (!parsed.success) return
        const data = parsed.output
        if (data.id !== id) return
        window.removeEventListener("message", handler)
        if ("error" in data) {
          reject({
            code: data.error.code,
            message: data.error.message,
            data: data.error.data,
          })
          return
        }
        resolve(data.result)
      },
    )
    window.postMessage(
      make_request({
        id,
        method: args.method,
        params: args.params,
        chainId: active_chain_id,
      }),
      window.location.origin,
    )
  })
}

async function forward_to_popup(
  args: RequestArguments,
): Promise<unknown> {
  // https://eips.ethereum.org/EIPS/eip-2255
  // wallet_requestPermissions is a connect-flow alias —
  // the popup only models eth_requestAccounts, so we
  // translate and synthesize the permission shape.
  if (args.method === "wallet_requestPermissions") {
    const next = await postmessage_and_wait({
      method: "eth_requestAccounts",
    })
    const parsed = safeParse(AddressesSchema, next)
    set_accounts(parsed.success ? parsed.output : [])
    return get_permissions()
  }
  const result = await postmessage_and_wait(args)
  if (args.method === "eth_requestAccounts") {
    const parsed = safeParse(AddressesSchema, result)
    set_accounts(parsed.success ? parsed.output : [])
  }
  return result
}

const handle_request = create_router({
  get_active_chain: () => active_chain_id,
  get_accounts: () => accounts,
  get_capabilities: () => compose_capabilities(),
  get_permissions,
  rpc_call,
  forward_to_popup,
  read_calls_status: (id) => compose_calls_status(id),
})

const provider: Provider = create_provider({
  request: handle_request,
})

window.addEventListener("message", (event) => {
  if (event.source !== window) return
  const notification = safeParse(
    RpcNotificationSchema,
    event.data,
  )
  if (!notification.success) return
  const note = notification.output
  // EIP-1193 event names ride on the JSON-RPC notification
  // envelope unchanged — `method` is the event name. The
  // page-context provider re-emits to dapps under the same
  // name. Wallet-internal notifications use a `wallet/*`
  // method prefix and are ignored here.
  if (note.method === "chainChanged") {
    const params = note.params
    const chain_id_hex = Array.isArray(params)
      ? params[0]
      : undefined
    if (typeof chain_id_hex === "string") {
      apply_chain_id_hex(chain_id_hex)
    }
    return
  }
  if (note.method === "accountsChanged") {
    const params = note.params
    const next = Array.isArray(params) ? params[0] : params
    const parsed = safeParse(AddressesSchema, next)
    if (parsed.success) set_accounts(parsed.output)
    return
  }
})

announce({
  info: {
    uuid: "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
    name: "Ethernauta",
    icon,
    rdns: "com.ethernauta.wallet",
  },
  provider,
})
