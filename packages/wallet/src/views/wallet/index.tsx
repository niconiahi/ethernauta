import { useEffect } from "preact/hooks"
import { wallet } from "../../utils/wallet"
import {
  balance,
  fetch_balance,
  wei_to_eth,
} from "../../utils/balance"

export function Wallet() {
  const address = wallet.value.address as `0x${string}`
  useEffect(() => {
    async function run() {
      const _balance = await fetch_balance(address)
      balance.value = _balance
    }
    run()
  }, [])
  return (
    <div>
      <p>the connected address is {address}</p>
      <p>it's balance is {wei_to_eth(balance.value)}</p>
    </div>
  )
}
