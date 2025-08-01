import { Password } from "./views/password/index.tsx"
import { Wallet } from "./views/wallet/index.tsx"
import { Mnemonics } from "./views/mnemonics/index.tsx"
import { Sign } from "./views/sign/index.tsx"
import { useEffect } from "preact/hooks"
import { vault_exists } from "./utils/vault.ts"
import { view } from "./utils/view.ts"
import * as v from "valibot"
import { CryptomanRequestSchema } from "./utils/event.ts"
import {
  is_authenticated,
  validate_vault,
} from "./utils/authentication.ts"
import { restore_wallet } from "./utils/wallet.ts"
import { transaction_request } from "./utils/transaction.ts"

export function Controller() {
  useEffect(() => {
    async function run() {
      const exists = await vault_exists()
      if (!exists) {
        view.value = "mnemonics"
      }
    }
    run()
  }, [])
  useEffect(() => {
    chrome.runtime.onMessage.addListener(
      async (message) => {
        const request = v.parse(
          CryptomanRequestSchema,
          message,
        )
        switch (request.type) {
          case "CRYPTOMAN_REQUEST_CONNECT": {
            const authenticated = await is_authenticated()
            await validate_vault(authenticated)
            if (authenticated) {
              await restore_wallet()
              view.value = "wallet"
              return
            }
            break
          }
          case "CRYPTOMAN_REQUEST_SIGN_TRANSACTION":
            {
              const authenticated = await is_authenticated()
              await validate_vault(authenticated)
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
