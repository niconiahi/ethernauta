/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../shared"

export const eip155_686868 = {
  "name": "Won Network",
  "shortName": "WonChain",
  "chain": "WON",
  "icon": "won",
  "rpc": [
    "https://rpc.wonnetwork.org"
  ],
  "faucets": [
    "https://faucet.wondollars.org"
  ],
  "nativeCurrency": {
    "name": "Won",
    "symbol": "WON",
    "decimals": 18
  },
  "infoURL": "https://wonnetwork.org",
  "chainId": 686868,
  "networkId": 686868,
  "explorers": [
    {
      "name": "Won Explorer",
      "url": "https://scan.wonnetwork.org",
      "standard": "EIP3091"
    }
  ]
} satisfies Chain