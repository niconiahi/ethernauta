import * as v from "valibot"
import { RequestSchema } from "../src/utils/event"

chrome.runtime.onMessage.addListener(
  (message, _, sendResponse) => {
    const request = v.parse(RequestSchema, message)
    if (request.type.startsWith("CRYPTOMAN_")) {
      chrome.action
        .openPopup()
        .then(() => {
          chrome.runtime.sendMessage(message)
        })
        .catch((error) => {
          sendResponse({ error: error.message })
        })
      return true
    }
  },
)
