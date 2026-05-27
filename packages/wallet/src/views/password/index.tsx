import { useState } from "preact/hooks"
import { Button } from "../../components/button"
import { set_timestamp } from "../../utils/authentication"
import { route_request } from "../../utils/router"
import { pending_request } from "../../utils/transaction"
import { validate_password } from "../../utils/vault"
import { view } from "../../utils/view"
import {
  init_accounts,
  restore_accounts,
} from "../../utils/wallet"

export function Password() {
  const [password, set_password] = useState("")
  const [error, set_error] = useState("")
  return (
    <main className="flex flex-col gap-2 p-2">
      <input
        type="password"
        placeholder="Password"
        value={password}
        className="p-2 border-2 rounded-md cursor-pointer text-base"
        onInput={(event) => {
          const value = event.currentTarget.value
          set_password(value)
          set_error("")
        }}
      />
      {error ? (
        <p className="text-[var(--danger)] text-sm">{error}</p>
      ) : null}
      <Button
        onClick={async () => {
          const valid = await validate_password(password)
          if (!valid) {
            set_error("Invalid password")
            return
          }
          await set_timestamp()
          await restore_accounts()
          await init_accounts(password)
          const pending = pending_request.value
          if (pending) {
            pending_request.value = null
            await route_request(pending)
            return
          }
          view.value = "wallet"
        }}
      >
        Unlock
      </Button>
    </main>
  )
}
