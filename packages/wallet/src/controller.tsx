import { typedDataSchema } from "@ethernauta/eip/712"
import { addEthereumChainParameterSchema } from "@ethernauta/eip/3085"
import { sendSetCodeTransactionParametersSchema } from "@ethernauta/eip/7702"
import { useEffect } from "preact/hooks"
import { parse } from "valibot"
import {
  is_authenticated,
  validate_vault,
} from "./utils/authentication"
import { EthernautaRequestSchema } from "./utils/event"
import {
  add_chain_request,
  connection_request,
  personal_sign_request,
  set_code_request,
  transaction_request,
  typed_data_request,
} from "./utils/transaction"
import { view } from "./utils/view"
import { restore_wallet } from "./utils/wallet"
import { AddChain } from "./views/add-chain/index"
import { AuthorizeDelegation } from "./views/authorize-delegation/index"
import { Connect } from "./views/connect/index"
import { Mnemonics } from "./views/mnemonics/index"
import { Password } from "./views/password/index"
import { PersonalSign } from "./views/personal-sign/index"
import { SelectChain } from "./views/select-chain/index"
import { Sign } from "./views/sign/index"
import { SignTypedData } from "./views/sign-typed-data/index"
import { Wallet } from "./views/wallet/index"

export function Controller() {
  useEffect(() => {
    chrome.runtime.connect({ name: "popup" })
    chrome.runtime.sendMessage({
      type: "ETHERNAUTA_NOTIFICATION_POPUP_READY",
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
          if (request.method === "eth_signTypedData_v4") {
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
          if (request.method === "personal_sign") {
            const params = request.params as [
              string,
              string,
            ]
            personal_sign_request.value = {
              id: request.id,
              message: params[0],
              address: params[1],
            }
            view.value = "personal-sign"
            return
          }
          if (
            request.method === "wallet_addEthereumChain"
          ) {
            const params = request.params as [unknown]
            const chain = parse(
              addEthereumChainParameterSchema,
              params[0],
            )
            add_chain_request.value = {
              id: request.id,
              chain,
            }
            view.value = "add-chain"
            return
          }
          if (
            request.method ===
            "wallet_sendSetCodeTransaction"
          ) {
            const parameters = parse(
              sendSetCodeTransactionParametersSchema,
              request.params,
            )
            set_code_request.value = {
              id: request.id,
              parameters,
            }
            view.value = "authorize-delegation"
            return
          }
          transaction_request.value = {
            id: request.id,
            method: request.method,
            params: request.params as unknown[],
            to: request.to,
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
    case "personal-sign": {
      return <PersonalSign />
    }
    case "add-chain": {
      return <AddChain />
    }
    case "authorize-delegation": {
      return <AuthorizeDelegation />
    }
    case "select-chain": {
      return <SelectChain />
    }
    default: {
      return <div>there is no view for: {view}</div>
    }
  }
}
