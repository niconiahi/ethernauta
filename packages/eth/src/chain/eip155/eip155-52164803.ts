/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../shared"

export const eip155_52164803 = {
  "name": "Fluence Testnet",
  "shortName": "fluence-testnet",
  "chain": "Fluence Testnet",
  "rpc": [
    "https://rpc.testnet.fluence.dev/",
    "wss://ws.testnet.fluence.dev/"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "tFLT",
    "symbol": "tFLT",
    "decimals": 18
  },
  "infoURL": "https://fluence.network/",
  "chainId": 52164803,
  "networkId": 52164803,
  "explorers": [
    {
      "name": "blockscout",
      "url": "https://blockscout.testnet.fluence.dev",
      "standard": "EIP3091"
    }
  ],
  "parent": {
    "type": "L2",
    "chain": "eip155-11155111"
  }
} satisfies Chain