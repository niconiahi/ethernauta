import { Password } from "./views/password/index"
import { Wallet } from "./views/wallet/index"
import { Mnemonics } from "./views/mnemonics/index"
import { Sign } from "./views/sign/index"
import { useEffect } from "preact/hooks"
import { view } from "./utils/view"
import { EthernautaRequestSchema } from "./utils/event"
import {
  is_authenticated,
  validate_vault,
} from "./utils/authentication"
import { restore_wallet } from "./utils/wallet"
import { transaction_request } from "./utils/transaction"
import { parse } from "valibot"

export function Controller() {
  useEffect(() => {
    chrome.runtime.onMessage.addListener(
      async (message) => {
        const request = parse(
          EthernautaRequestSchema,
          message,
        )
        switch (request.type) {
          case "ETHERNAUTA_REQUEST_CONNECT": {
            const authenticated = await is_authenticated()
            await validate_vault()
            if (authenticated) {
              await restore_wallet()
              view.value = "wallet"
              return
            }
            break
          }
          case "ETHERNAUTA_REQUEST_SIGN_TRANSACTION":
            {
              const authenticated = await is_authenticated()
              await validate_vault()
              if (authenticated) {
                await restore_wallet()
                transaction_request.value = {
                  id: request.id,
                  method: request.method,
                  params: request.params,
                }
                view.value = "sign"
                return
              }
            }
            break
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
