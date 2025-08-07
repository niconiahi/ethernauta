/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../shared"

export const eip155_622463 = {
  "name": "Atlas",
  "shortName": "atlas-testnet",
  "title": "Atlas Testnet",
  "chain": "ATLAS",
  "icon": "atlas",
  "rpc": [
    "https://rpc.testnet.atl.network"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "TON",
    "symbol": "TON",
    "decimals": 18
  },
  "infoURL": "https://atl.network",
  "chainId": 622463,
  "networkId": 622463,
  "explorers": [
    {
      "name": "Atlas Testnet Scan",
      "url": "https://explorer.testnet.atl.network",
      "standard": "EIP3091"
    }
  ]
} satisfies Chain