import { parse } from "valibot"
import {
  CryptomanEventSchema,
  CryptomanRequestSchema,
  CryptomanResponseSchema,
} from "../src/utils/event"
import invariant from "../src/utils/tiny-invariant"

function compose_key(id: string) {
  return `pending_${id}`
}

chrome.runtime.onMessage.addListener(
  async (message, sender) => {
    const event = parse(CryptomanEventSchema, message)
    if (event.type.startsWith("ETHERNAUTA_REQUEST")) {
      const request = parse(CryptomanRequestSchema, message)
      console.log("receiving request", request)
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
          chrome.runtime.sendMessage(request)
        })
        .catch(async () => {
          // await chrome.storage.session.remove(
          //   `pending_${request.id}`,
          // )
        })
      return true // enables sendResponse to be executed later on
    }
    if (event.type.startsWith("ETHERNAUTA_RESPONSE")) {
      const response = parse(
        CryptomanResponseSchema,
        message,
      )
      console.log("returning response", response)
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
