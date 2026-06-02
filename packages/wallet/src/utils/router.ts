import { TypedDataSchema } from "@ethernauta/eip/712"
import { SwitchEthereumChainParametersSchema } from "@ethernauta/eip/3326"
import { SendCallsParameterSchema } from "@ethernauta/eip/5792"
import { SendSetCodeTransactionParametersSchema } from "@ethernauta/eip/7702"
import { parse, string, tuple } from "valibot"
import type { EthernautaRequest } from "./event"
import {
  connection_request,
  personal_sign_request,
  send_calls_request,
  set_code_request,
  switch_chain_request,
  transaction_request,
  typed_data_request,
} from "./transaction"
import { view } from "./view"
import { restore_accounts } from "./wallet"

export async function route_request(
  request: EthernautaRequest,
): Promise<void> {
  await restore_accounts()
  if (request.method === "eth_requestAccounts") {
    connection_request.value = { id: request.id }
    view.value = "connect"
    return
  }
  if (request.method === "eth_signTypedData_v4") {
    const [address, typed_data] = parse(
      tuple([string(), TypedDataSchema]),
      request.params,
    )
    typed_data_request.value = {
      id: request.id,
      address,
      typed_data,
    }
    view.value = "sign-typed-data"
    return
  }
  if (request.method === "personal_sign") {
    const [message, address] = parse(
      tuple([string(), string()]),
      request.params,
    )
    personal_sign_request.value = {
      id: request.id,
      message,
      address,
    }
    view.value = "personal-sign"
    return
  }
  if (request.method === "wallet_switchEthereumChain") {
    const [parameter] = parse(
      SwitchEthereumChainParametersSchema,
      request.params,
    )
    switch_chain_request.value = {
      id: request.id,
      parameter,
    }
    view.value = "switch-chain"
    return
  }
  if (request.method === "wallet_sendCalls") {
    const [parameter] = parse(
      tuple([SendCallsParameterSchema]),
      request.params,
    )
    send_calls_request.value = {
      id: request.id,
      parameter,
    }
    view.value = "send-calls"
    return
  }
  if (request.method === "wallet_sendSetCodeTransaction") {
    const parameters = parse(
      SendSetCodeTransactionParametersSchema,
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
    params: request.params ?? [],
    to: request.to,
  }
  view.value = "sign"
}
