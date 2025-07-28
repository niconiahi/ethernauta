import { Password } from "./views/password/index.tsx"
import { Wallet } from "./views/wallet/index.tsx"
import { Mnemonics } from "./views/mnemonics/index.tsx"
import { useEffect } from "preact/hooks"
import { vault_exists } from "./utils/vault.ts"
import { view } from "./utils/view.ts"
import * as v from "valibot"
import { RequestSchema } from "./utils/event.ts"
import { is_authenticated } from "./utils/authentication.ts"
import { restore_wallet } from "./utils/wallet.ts"

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
      async (message, sender, sendResponse) => {
        const request = v.parse(RequestSchema, message)
        switch (request.type) {
          case "CRYPTOMAN_CONNECT": {
            console.log("message", message)
            console.log("sender", sender)
            console.log("sendResponse", sendResponse)
            const authenticated = await is_authenticated()
            if (authenticated) {
              await restore_wallet()
              view.value = "wallet"
              return
            }
            const exists = await vault_exists()
            if (!exists) {
              view.value = "mnemonics"
            } else {
              if (!authenticated) {
                view.value = "mnemonics"
                return
              }
              view.value = "password"
            }
          }
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
    default: {
      return <div>there is no view for: {view}</div>
    }
  }
}
