import { useEffect } from "preact/hooks"
import {
  balance,
  fetch_balance,
  wei_to_eth,
} from "../../utils/balance"
import { wallet } from "../../utils/wallet"

// const BATCH_SIZE = 50
// async function get_blocks(start: number, end: number) {
//   for (let i = 0; i < end; i += BATCH_SIZE) {
//     const last = Math.min(start + BATCH_SIZE - 1, end)
//   }
// }

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
