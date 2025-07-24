/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../../shared"

export const eip155_1117 = {
  "name": "Dogcoin Mainnet",
  "shortName": "DOGSm",
  "chain": "DOGS",
  "icon": "dogs",
  "rpc": [
    "https://mainnet-rpc.dogcoin.me"
  ],
  "faucets": [
    "https://faucet.dogcoin.network"
  ],
  "nativeCurrency": {
    "name": "Dogcoin",
    "symbol": "DOGS",
    "decimals": 18
  },
  "infoURL": "https://dogcoin.network",
  "chainId": 1117,
  "networkId": 1117,
  "explorers": [
    {
      "name": "Dogcoin",
      "url": "https://explorer.dogcoin.network",
      "standard": "EIP3091"
    }
  ]
} satisfies Chain