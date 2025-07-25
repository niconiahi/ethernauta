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
import { wallet } from "../../utils/wallet"
import { view } from "../../utils/view"

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
          const vault = await get_vault(password)
          invariant(vault, "vault should exist to sign in")
          const seed = mnemonic_to_seed(vault)
          const master_key = seed_to_master_key(seed)
          const private_key = derive_private_key(master_key)
          const address =
            private_key_to_address(private_key)
          wallet.value = {
            address,
            key: master_key,
          }
          view.value = "wallet"
        }}
      >
        unlock
      </button>
    </div>
  )
}
