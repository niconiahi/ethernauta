/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../../shared"

export const eip155_5290 = {
  "name": "Firechain Mainnet Old",
  "shortName": "_old_fire",
  "chain": "FIRE",
  "icon": "firechain",
  "rpc": [
    "https://mainnet.rpc1.thefirechain.com"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "Firechain",
    "symbol": "FIRE",
    "decimals": 18
  },
  "infoURL": "https://thefirechain.com",
  "chainId": 5290,
  "networkId": 5290,
  "explorers": [],
  "status": "deprecated"
} satisfies Chain