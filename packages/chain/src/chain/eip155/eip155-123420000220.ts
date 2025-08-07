/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../shared"

export const eip155_123420000220 = {
  "name": "Fluence Stage",
  "shortName": "fluence-stage",
  "chain": "Fluence Stage (Testnet)",
  "rpc": [
    "https://rpc.stage.fluence.dev",
    "wss://ws.stage.fluence.dev"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "tFLT",
    "symbol": "tFLT",
    "decimals": 18
  },
  "infoURL": "https://fluence.network/",
  "chainId": 123420000220,
  "networkId": 123420000220,
  "explorers": [
    {
      "name": "blockscout",
      "url": "https://blockscout.stage.fluence.dev",
      "standard": "EIP3091"
    }
  ],
  "parent": {
    "type": "L2",
    "chain": "eip155-11155111"
  }
} satisfies Chain