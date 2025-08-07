/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../shared"

export const eip155_998899 = {
  "name": "Supernet Testnet",
  "shortName": "supernetchain",
  "title": "Supernet Testnet",
  "chain": "Supernet Testnet",
  "rpc": [
    "https://testnet-rpc.supernet.chaingames.io/"
  ],
  "faucets": [
    "https://faucet.chaingames.io"
  ],
  "nativeCurrency": {
    "name": "CHAIN",
    "symbol": "CHAIN",
    "decimals": 18
  },
  "infoURL": "",
  "chainId": 998899,
  "networkId": 998899,
  "slip44": 1,
  "explorers": [
    {
      "name": "supernet-testnet-explorer",
      "url": "https://testnet-explorer.supernet.chaingames.io",
      "standard": "EIP3091"
    }
  ]
} satisfies Chain