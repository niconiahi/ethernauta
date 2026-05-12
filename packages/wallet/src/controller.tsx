import { useEffect } from "preact/hooks"
import { parse } from "valibot"
import {
  is_authenticated,
  validate_vault,
} from "./utils/authentication"
import { EthernautaRequestSchema } from "./utils/event"
import { transaction_request } from "./utils/transaction"
import { view } from "./utils/view"
import { restore_wallet } from "./utils/wallet"
import { Mnemonics } from "./views/mnemonics/index"
import { Password } from "./views/password/index"
import { Sign } from "./views/sign/index"
import { Wallet } from "./views/wallet/index"

export function Controller() {
  useEffect(() => {
    chrome.runtime.connect({ name: "popup" })
    chrome.runtime.sendMessage({
      type: "ETHERNAUTA_POPUP_READY",
    })
    chrome.runtime.onMessage.addListener(
      async (message) => {
        const request = parse(
          EthernautaRequestSchema,
          message,
        )
        if (
          request.type ===
          "ETHERNAUTA_REQUEST_SIGN_TRANSACTION"
        ) {
          const authenticated = await is_authenticated()
          await validate_vault()
          if (!authenticated) return
          await restore_wallet()
          if (request.method === "eth_requestAccounts") {
            view.value = "wallet"
            return
          }
          transaction_request.value = {
            id: request.id,
            method: request.method,
            params: request.params as unknown[],
          }
          view.value = "sign"
        }
      },
    )
  }, [])
  return <>{render_view(view.value)}</>
}

function render_view(view: string) {
  switch (view) {
    case "mnemonics": {
      return <Mnemonics />
    }
    case "password": {
      return <Password />
    }
    case "wallet": {
      return <Wallet />
    }
    case "sign": {
      return <Sign />
    }
    default: {
      return <div>there is no view for: {view}</div>
    }
  }
}
