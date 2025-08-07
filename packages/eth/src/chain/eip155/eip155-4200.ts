/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../shared"

export const eip155_4200 = {
  "name": "Merlin Mainnet",
  "shortName": "Merlin-Mainnet",
  "title": "Merlin Mainnet",
  "chain": "Merlin",
  "icon": "merlin",
  "rpc": [
    "https://rpc.merlinchain.io",
    "https://merlin-mainnet-enterprise.unifra.io",
    "https://rpc-merlin.rockx.com"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "BTC",
    "symbol": "BTC",
    "decimals": 18
  },
  "infoURL": "https://merlinchain.io",
  "chainId": 4200,
  "networkId": 4200,
  "explorers": [
    {
      "name": "L2scan",
      "url": "https://scan.merlinchain.io",
      "standard": "EIP3091"
    }
  ]
} satisfies Chain