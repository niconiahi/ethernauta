/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../../shared"

export const eip155_9170 = {
  "name": "Rinia Testnet Old",
  "shortName": "_old_tfire",
  "chain": "FIRE",
  "icon": "rinia",
  "rpc": [],
  "faucets": [
    "https://faucet.thefirechain.com"
  ],
  "nativeCurrency": {
    "name": "Firechain",
    "symbol": "FIRE",
    "decimals": 18
  },
  "infoURL": "https://thefirechain.com",
  "chainId": 9170,
  "networkId": 9170,
  "slip44": 1,
  "explorers": [],
  "status": "deprecated"
} satisfies Chain