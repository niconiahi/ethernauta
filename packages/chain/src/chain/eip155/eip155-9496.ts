/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../shared"

export const eip155_9496 = {
  "name": "Load Alphanet",
  "shortName": "tload",
  "chain": "LOAD",
  "icon": "loadnetwork",
  "rpc": [
    "https://alphanet.load.network"
  ],
  "faucets": [
    "https://load.network/faucet"
  ],
  "nativeCurrency": {
    "name": "Testnet Load Token",
    "symbol": "tLOAD",
    "decimals": 18
  },
  "infoURL": "https://load.network",
  "chainId": 9496,
  "networkId": 9496,
  "explorers": [
    {
      "name": "Load Network Explorer",
      "url": "https://explorer.load.network",
      "standard": "EIP3091"
    }
  ]
} satisfies Chain