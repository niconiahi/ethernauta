/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../shared"

export const eip155_9999999 = {
  "name": "Fluence",
  "shortName": "fluence",
  "chain": "Fluence",
  "rpc": [
    "https://rpc.mainnet.fluence.dev/",
    "wss://ws.mainnet.fluence.dev/"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "FLT",
    "symbol": "FLT",
    "decimals": 18
  },
  "infoURL": "https://fluence.network/",
  "chainId": 9999999,
  "networkId": 9999999,
  "explorers": [
    {
      "name": "blockscout",
      "url": "https://blockscout.mainnet.fluence.dev",
      "standard": "EIP3091"
    }
  ],
  "parent": {
    "type": "L2",
    "chain": "eip155-1"
  }
} satisfies Chain