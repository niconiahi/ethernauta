import {
  number,
  object,
  optional,
  safeParse,
  string,
} from "valibot"
import {
  make_notification,
  RpcNotificationSchema,
  RpcRequestSchema,
  RpcResponseSchema,
} from "../src/utils/event"

const script = document.createElement("script")
script.src = chrome.runtime.getURL("wallet.mjs")
script.type = "module"
script.onload = () => {
  // Replay the persisted chain to the page-context provider
  // right after it boots. The provider can't read
  // chrome.storage itself (it runs in page context), and
  // without this the dapp would see mainnet at page load no
  // matter what the user previously selected in the popup.
  replay_active_chain()
  script.remove()
}
document.head.appendChild(script)

const StoredChainSchema = object({
  selected_chain: optional(
    object({
      id: number(),
      name: string(),
      rpc_url: string(),
    }),
  ),
})

async function replay_active_chain(): Promise<void> {
  const raw = await chrome.storage.local.get([
    "selected_chain",
  ])
  const result = safeParse(StoredChainSchema, raw)
  if (!result.success) return
  const stored = result.output.selected_chain
  if (!stored) return
  // Same JSON-RPC notification the popup would emit on a
  // live switch — symmetric handling on the page-context
  // side.
  window.postMessage(
    make_notification("chainChanged", [
      `0x${stored.id.toString(16)}`,
    ]),
    window.location.origin,
  )
}

// Page-context → background. Validate against the JSON-RPC
// request schema before forwarding — the page broadcasts
// every postMessage to every script, so the bus carries
// noise (other wallets, iframes, dev tools); safeParse is
// the filter.
window.addEventListener("message", (event) => {
  if (event.source !== window) return
  const parsed = safeParse(RpcRequestSchema, event.data)
  if (!parsed.success) return
  chrome.runtime.sendMessage(parsed.output)
})

// Background → page-context. Responses and notifications
// flow this direction; requests do not. Try each schema in
// turn — first match wins and gets forwarded onto the page.
chrome.runtime.onMessage.addListener((message) => {
  const response = safeParse(RpcResponseSchema, message)
  if (response.success) {
    window.postMessage(
      response.output,
      window.location.origin,
    )
    return
  }
  const notification = safeParse(
    RpcNotificationSchema,
    message,
  )
  if (notification.success) {
    window.postMessage(
      notification.output,
      window.location.origin,
    )
  }
})
