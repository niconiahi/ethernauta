import { useEffect } from "preact/hooks"
import { safeParse } from "valibot"
import {
  is_authenticated,
  validate_vault,
} from "./utils/authentication"
import { restore_chain } from "./utils/chain"
import {
  make_notification,
  RpcRequestSchema,
  WALLET_METHOD,
} from "./utils/event"
import { route_request } from "./utils/router"
import { pending_request } from "./utils/transaction"
import { view } from "./utils/view"
import { AuthorizeDelegation } from "./views/authorize-delegation/index"
import { Connect } from "./views/connect/index"
import { Mnemonics } from "./views/mnemonics/index"
import { Password } from "./views/password/index"
import { PersonalSign } from "./views/personal-sign/index"
import { SelectAccount } from "./views/select-account/index"
import { SelectChain } from "./views/select-chain/index"
import { SendCalls } from "./views/send-calls/index"
import { Sign } from "./views/sign/index"
import { SignTypedData } from "./views/sign-typed-data/index"
import { SwitchChain } from "./views/switch-chain/index"
import { Wallet } from "./views/wallet/index"

export function Controller() {
  useEffect(() => {
    restore_chain()
    chrome.runtime.connect({ name: "popup" })
    chrome.runtime.sendMessage(
      make_notification(WALLET_METHOD.POPUP_READY),
    )
    chrome.runtime.onMessage.addListener(
      async (message) => {
        const parsed = safeParse(RpcRequestSchema, message)
        if (!parsed.success) return
        const request = parsed.output
        const authenticated = await is_authenticated()
        if (!authenticated) {
          pending_request.value = request
          await validate_vault()
          return
        }
        await route_request(request)
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
    case "switch-chain": {
      return <SwitchChain />
    }
    case "authorize-delegation": {
      return <AuthorizeDelegation />
    }
    case "send-calls": {
      return <SendCalls />
    }
    case "select-chain": {
      return <SelectChain />
    }
    case "select-account": {
      return <SelectAccount />
    }
    default: {
      return <div>there is no view for: {view}</div>
    }
  }
}
