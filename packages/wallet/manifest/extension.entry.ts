import {
  number,
  object,
  parse,
  safeParse,
  string,
} from "valibot"
import {
  compose_calls_status,
  compose_capabilities,
} from "../src/utils/calls-status"
import {
  make_error,
  make_success,
  RpcNotificationSchema,
  RpcRequestSchema,
  RpcResponseSchema,
  WALLET_METHOD,
} from "../src/utils/event"

const PendingRecordSchema = object({
  tab_id: number(),
  request: object({ id: string() }),
})

function compose_key(id: string) {
  return `pending_${id}`
}

// Internal-handled methods: the background answers them
// directly without involving the popup. EIP-5792
// wallet_getCapabilities and wallet_getCallsStatus are pure
// reads against wallet-cached state — popping a confirmation
// would be noise.
const BACKGROUND_HANDLED = new Set<string>([
  "wallet_getCapabilities",
  "wallet_getCallsStatus",
])

chrome.runtime.onConnect.addListener((port) => {
  port.onDisconnect.addListener(async () => {
    const session = await chrome.storage.session.get(null)
    for (const [key, value] of Object.entries(session)) {
      if (!key.startsWith("pending_")) continue
      const { tab_id, request } = parse(
        PendingRecordSchema,
        value,
      )
      // Popup closed without responding — surface as a
      // user-rejected request to the dapp, JSON-RPC style.
      const rejection = make_error(
        request.id,
        4001,
        "Extension closed",
      )
      chrome.tabs.sendMessage(tab_id, rejection)
      await chrome.storage.session.remove(key)
    }
  })
})

chrome.runtime.onMessage.addListener(
  async (message, sender) => {
    // Request — dapp → bg → popup (or bg-handled directly).
    const request_parsed = safeParse(
      RpcRequestSchema,
      message,
    )
    if (request_parsed.success) {
      const request = request_parsed.output
      const tab_id = parse(number(), sender.tab?.id)
      if (BACKGROUND_HANDLED.has(request.method)) {
        try {
          const payload =
            request.method === "wallet_getCapabilities"
              ? compose_capabilities()
              : await compose_calls_status(
                  Array.isArray(request.params)
                    ? String(request.params[0] ?? "")
                    : "",
                )
          chrome.tabs.sendMessage(
            tab_id,
            make_success(request.id, payload),
          )
        } catch (error) {
          chrome.tabs.sendMessage(
            tab_id,
            make_error(
              request.id,
              4001,
              error instanceof Error
                ? error.message
                : "Unknown error",
            ),
          )
        }
        return true
      }
      const key = compose_key(request.id)
      await chrome.storage.session.set({
        [key]: { tab_id, request: { id: request.id } },
      })
      chrome.action
        .openPopup()
        .then(() => {
          chrome.runtime.onMessage.addListener(
            function ready_handler(ready_message) {
              const ready = safeParse(
                RpcNotificationSchema,
                ready_message,
              )
              if (!ready.success) return
              if (
                ready.output.method !==
                WALLET_METHOD.POPUP_READY
              )
                return
              chrome.runtime.onMessage.removeListener(
                ready_handler,
              )
              chrome.runtime.sendMessage(request)
            },
          )
        })
        .catch(async () => {
          await chrome.storage.session.remove(key)
        })
      return true
    }
    // Response — popup → bg → originating tab.
    const response_parsed = safeParse(
      RpcResponseSchema,
      message,
    )
    if (response_parsed.success) {
      const response = response_parsed.output
      const key = compose_key(response.id)
      const session_results =
        await chrome.storage.session.get(key)
      const pending_parsed = safeParse(
        PendingRecordSchema,
        session_results[key],
      )
      if (pending_parsed.success) {
        chrome.tabs.sendMessage(
          pending_parsed.output.tab_id,
          response,
        )
        await chrome.storage.session.remove(key)
      }
      return
    }
    // Notification — events broadcast to all tabs, except
    // wallet-internal ones (wallet/popup_ready handled
    // above) which stay in the background.
    const notification_parsed = safeParse(
      RpcNotificationSchema,
      message,
    )
    if (notification_parsed.success) {
      const notification = notification_parsed.output
      if (notification.method.startsWith("wallet/")) return
      const tabs = await chrome.tabs.query({})
      for (const tab of tabs) {
        if (tab.id)
          chrome.tabs.sendMessage(tab.id, notification)
      }
    }
  },
)
