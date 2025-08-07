/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../shared"

export const eip155_4653 = {
  "name": "Gold Chain",
  "shortName": "gold",
  "title": "Gold Chain",
  "chain": "Gold",
  "icon": "gold",
  "rpc": [
    "https://chain-rpc.gold.dev"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "Ether",
    "symbol": "ETH",
    "decimals": 18
  },
  "infoURL": "https://gold.dev",
  "chainId": 4653,
  "networkId": 4653,
  "status": "incubating"
} satisfies Chain