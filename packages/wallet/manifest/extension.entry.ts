import { invariant } from "@ethernauta/utils"
import { parse } from "valibot"
import {
  EthernautaEventSchema,
  EthernautaRequestSchema,
  EthernautaResponseSchema,
  type NativeExtensionCloseResponse,
} from "../src/utils/event"

function compose_key(id: string) {
  return `pending_${id}`
}

chrome.runtime.onConnect.addListener((port) => {
  port.onDisconnect.addListener(async () => {
    const session = await chrome.storage.session.get(null)
    for (const [key, value] of Object.entries(session)) {
      if (!key.startsWith("pending_")) continue
      const { tab_id, request } = value as {
        tab_id: number
        request: { id: string }
      }
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
      const tab_id = sender.tab?.id
      invariant(tab_id, "request must come from a tab")
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
                message.type === "ETHERNAUTA_POPUP_READY"
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
      const pending_request = session_results[key]
      invariant(
        pending_request,
        "there should be a pending request for this response",
      )
      chrome.tabs.sendMessage(
        pending_request.tab_id,
        response,
      )
      await chrome.storage.session.remove(
        `pending_${response.id}`,
      )
    }
  },
)
