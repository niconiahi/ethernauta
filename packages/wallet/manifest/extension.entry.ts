import * as v from "valibot"
import {
  CryptomanEventSchema,
  CryptomanRequestSchema,
  CryptomanResponseSchema,
} from "../src/utils/event"

chrome.runtime.onMessage.addListener(
  async (message, _, sendResponse) => {
    const event = v.parse(CryptomanEventSchema, message)
    console.log("extension.entry.ts => event", event)
    if (event.type.startsWith("CRYPTOMAN_REQUEST")) {
      const request = v.parse(
        CryptomanRequestSchema,
        message,
      )
      console.log("extension.entry.ts => request", request)
      chrome.action
        .openPopup()
        .then(() => {
          chrome.runtime.sendMessage(request)
        })
        .catch(() => {
          console.log("error when trying to open the popup")
        })
    }
    if (event.type.startsWith("CRYPTOMAN_RESPONSE")) {
      const response = v.parse(
        CryptomanResponseSchema,
        message,
      )
      console.log(
        "extension.entry.ts => response",
        response,
      )
      sendResponse(response)
    }
  },
)
