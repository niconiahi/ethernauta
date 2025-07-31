import { useState } from "preact/hooks"
import { validate_password } from "../../utils/vault"
import { set_wallet } from "../../utils/wallet"
import { view } from "../../utils/view"
import { set_timestamp } from "../../utils/authentication"

export function Password() {
  const [password, set_password] = useState("")
  return (
    <div>
      <input
        placeholder="Password"
        value={password}
        onInput={(event) => {
          const value = event.currentTarget.value
          set_password(value)
        }}
      />
      <button
        type="button"
        onClick={async () => {
          const valid = await validate_password(password)
          if (!valid) return
          await set_timestamp()
          await set_wallet(password)
          view.value = "wallet"
        }}
      >
        unlock
      </button>
    </div>
  )
}
