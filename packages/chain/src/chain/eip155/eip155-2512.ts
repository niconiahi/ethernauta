/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../shared"

export const eip155_2512 = {
  "name": "K2 Testnet",
  "shortName": "K2-testnet",
  "chain": "K2",
  "icon": "karak",
  "rpc": [],
  "faucets": [],
  "nativeCurrency": {
    "name": "Ether",
    "symbol": "ETH",
    "decimals": 18
  },
  "infoURL": "https://karak.network",
  "chainId": 2512,
  "networkId": 2512,
  "status": "incubating"
} satisfies Chain