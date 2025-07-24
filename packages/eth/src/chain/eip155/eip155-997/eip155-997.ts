/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../../shared"

export const eip155_997 = {
  "name": "5ireChain Thunder",
  "shortName": "5ire",
  "chain": "5ireChain",
  "icon": "5ireChain",
  "rpc": [
    "https://rpc-testnet.5ire.network"
  ],
  "faucets": [
    "https://explorer.5ire.network/faucet"
  ],
  "nativeCurrency": {
    "name": "5ire Token",
    "symbol": "5ire",
    "decimals": 18
  },
  "infoURL": "https://5ire.org",
  "chainId": 997,
  "networkId": 997,
  "explorers": [
    {
      "name": "5ireChain Explorer",
      "url": "https://explorer.5ire.network",
      "standard": "none"
    }
  ]
} satisfies Chain