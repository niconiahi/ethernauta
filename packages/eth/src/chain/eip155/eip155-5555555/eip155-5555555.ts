/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../../shared"

export const eip155_5555555 = {
  "name": "Imversed Mainnet",
  "shortName": "imversed",
  "chain": "Imversed",
  "icon": "imversed",
  "rpc": [
    "https://jsonrpc.imversed.network",
    "https://ws-jsonrpc.imversed.network"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "Imversed Token",
    "symbol": "IMV",
    "decimals": 18
  },
  "infoURL": "https://imversed.com",
  "chainId": 5555555,
  "networkId": 5555555,
  "explorers": [
    {
      "name": "Imversed EVM explorer (Blockscout)",
      "url": "https://txe.imversed.network",
      "standard": "EIP3091"
    },
    {
      "name": "Imversed Cosmos Explorer (Big Dipper)",
      "url": "https://tex-c.imversed.com",
      "standard": "none"
    }
  ]
} satisfies Chain