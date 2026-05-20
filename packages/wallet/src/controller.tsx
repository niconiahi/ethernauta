import { typedDataSchema } from "@ethernauta/eip/712"
import { useEffect } from "preact/hooks"
import { parse } from "valibot"
import {
  is_authenticated,
  validate_vault,
} from "./utils/authentication"
import { EthernautaRequestSchema } from "./utils/event"
import {
  connection_request,
  transaction_request,
  typed_data_request,
} from "./utils/transaction"
import { view } from "./utils/view"
import { restore_wallet } from "./utils/wallet"
import { Connect } from "./views/connect/index"
import { Mnemonics } from "./views/mnemonics/index"
import { Password } from "./views/password/index"
import { Sign } from "./views/sign/index"
import { SignTypedData } from "./views/sign-typed-data/index"
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
            connection_request.value = { id: request.id }
            view.value = "connect"
            return
          }
          if (
            request.method === "eth_signTypedData_v4"
          ) {
            const params = request.params as [
              string,
              unknown,
            ]
            const typed_data = parse(
              typedDataSchema,
              params[1],
            )
            typed_data_request.value = {
              id: request.id,
              address: params[0],
              typed_data,
            }
            view.value = "sign-typed-data"
            return
          }
          transaction_request.value = {
            id: request.id,
            method: request.method,
            params: request.params as unknown[],
            to: request.to,
            _function: request._function,
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
    case "connect": {
      return <Connect />
    }
    case "sign": {
      return <Sign />
    }
    case "sign-typed-data": {
      return <SignTypedData />
    }
    default: {
      return <div>there is no view for: {view}</div>
    }
  }
}
