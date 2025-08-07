/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../shared"

export const eip155_5106 = {
  "name": "Azra Testnet",
  "shortName": "azra-testnet",
  "chain": "Azra Testnet",
  "rpc": [
    "https://rpc-azra-testnet-6hz86owb1n.t.conduit.xyz"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "ETH",
    "symbol": "ETH",
    "decimals": 18
  },
  "infoURL": "https://azragames.com",
  "chainId": 5106,
  "networkId": 5106,
  "explorers": [
    {
      "name": "blockscout",
      "url": "https://explorerl2new-azra-testnet-6hz86owb1n.t.conduit.xyz",
      "standard": "EIP3091"
    }
  ]
} satisfies Chain