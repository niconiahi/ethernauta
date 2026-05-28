import { number, object, parse, string } from "valibot"
import {
  compose_calls_status,
  compose_capabilities,
} from "../src/utils/calls-status"
import {
  EthernautaEventSchema,
  EthernautaRequestSchema,
  EthernautaResponseSchema,
  type NativeExtensionCloseResponse,
  type SignTransactionResponse,
} from "../src/utils/event"

const PendingRecordSchema = object({
  tab_id: number(),
  request: object({ id: string() }),
})

function compose_key(id: string) {
  return `pending_${id}`
}

chrome.runtime.onConnect.addListener((port) => {
  port.onDisconnect.addListener(async () => {
    const session = await chrome.storage.session.get(null)
    for (const [key, value] of Object.entries(session)) {
      if (!key.startsWith("pending_")) continue
      const { tab_id, request } = parse(
        PendingRecordSchema,
        value,
      )
      const response: NativeExtensionCloseResponse = {
        id: request.id,
        type: "ETHERNAUTA_RESPONSE_NATIVE_EXTENSION_CLOSE",
      }
      chrome.tabs.sendMessage(tab_id, response)
      await chrome.storage.session.remove(key)
    }
  })
})

chrome.runtime.onMessage.addListener(
  async (message, sender) => {
    const event = parse(EthernautaEventSchema, message)
    if (event.type.startsWith("ETHERNAUTA_REQUEST")) {
      const request = parse(
        EthernautaRequestSchema,
        message,
      )
      const tab_id = parse(number(), sender.tab?.id)
      if (
        request.method === "wallet_getCapabilities" ||
        request.method === "wallet_getCallsStatus"
      ) {
        try {
          const payload =
            request.method === "wallet_getCapabilities"
              ? compose_capabilities()
              : await compose_calls_status(
                  (request.params as [string])[0],
                )
          const response: SignTransactionResponse = {
            id: request.id,
            type: "ETHERNAUTA_RESPONSE_SIGNED_TRANSACTION",
            signed_transaction: JSON.stringify(payload),
          }
          chrome.tabs.sendMessage(tab_id, response)
        } catch {
          const rejected = {
            id: request.id,
            type: "ETHERNAUTA_RESPONSE_TRANSACTION_REJECTED" as const,
          }
          chrome.tabs.sendMessage(tab_id, rejected)
        }
        return true
      }
      const key = compose_key(request.id)
      await chrome.storage.session.set({
        [key]: {
          tab_id,
          request,
        },
      })
      chrome.action
        .openPopup()
        .then(() => {
          chrome.runtime.onMessage.addListener(
            function ready_handler(message) {
              if (
                message.type ===
                "ETHERNAUTA_NOTIFICATION_POPUP_READY"
              ) {
                chrome.runtime.onMessage.removeListener(
                  ready_handler,
                )
                chrome.runtime.sendMessage(request)
              }
            },
          )
        })
        .catch(async () => {
          await chrome.storage.session.remove(key)
        })
      return true // enables sendResponse to be executed later on
    }
    if (event.type.startsWith("ETHERNAUTA_RESPONSE")) {
      const response = parse(
        EthernautaResponseSchema,
        message,
      )
      const key = compose_key(response.id)
      const session_results =
        await chrome.storage.session.get(key)
      const pending_request = parse(
        PendingRecordSchema,
        session_results[key],
      )
      chrome.tabs.sendMessage(
        pending_request.tab_id,
        response,
      )
      await chrome.storage.session.remove(
        `pending_${response.id}`,
      )
    }
    if (
      event.type ===
        "ETHERNAUTA_NOTIFICATION_CHAIN_SELECTED" ||
      event.type ===
        "ETHERNAUTA_NOTIFICATION_ACCOUNTS_CHANGED"
    ) {
      const tabs = await chrome.tabs.query({})
      for (const tab of tabs) {
        if (tab.id) chrome.tabs.sendMessage(tab.id, event)
      }
    }
  },
)
