import { Password } from "./views/password/index.tsx"
import { Wallet } from "./views/wallet/index.tsx"
import { Mnemonics } from "./views/mnemonics/index.tsx"
import { useEffect } from "preact/hooks"
import { vault_exists } from "./utils/vault.ts"
import { view } from "./utils/view.ts"

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
