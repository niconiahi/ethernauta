/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../../shared"

export const eip155_24 = {
  "name": "KardiaChain Mainnet",
  "shortName": "kardiachain",
  "chain": "KAI",
  "icon": "kardiachain",
  "rpc": [
    "https://rpc.kardiachain.io"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "KardiaChain",
    "symbol": "KAI",
    "decimals": 18
  },
  "infoURL": "https://kardiachain.io",
  "chainId": 24,
  "networkId": 0,
  "redFlags": [
    "reusedChainId"
  ]
} satisfies Chain