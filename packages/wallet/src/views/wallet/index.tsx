import { wallet } from "../../utils/wallet"

export function Wallet() {
  return (
    <div>
      <span>
        the connected address is {wallet.value.address}
      </span>
    </div>
  )
}
