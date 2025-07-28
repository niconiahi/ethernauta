import { useState } from "preact/hooks"
import {
  get_vault,
  validate_password,
} from "../../utils/vault"
import invariant from "../../utils/tiny-invariant"
import {
  derive_private_key,
  mnemonic_to_seed,
  private_key_to_address,
  seed_to_master_key,
} from "../../utils/crypto"
import {
  save_wallet,
  set_wallet,
  wallet,
} from "../../utils/wallet"
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
