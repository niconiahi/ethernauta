/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../../shared"

export const eip155_1000 = {
  "name": "GTON Mainnet",
  "shortName": "gton",
  "chain": "GTON",
  "rpc": [
    "https://rpc.gton.network/"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "GCD",
    "symbol": "GCD",
    "decimals": 18
  },
  "infoURL": "https://gton.capital",
  "chainId": 1000,
  "networkId": 1000,
  "explorers": [
    {
      "name": "GTON Network Explorer",
      "url": "https://explorer.gton.network",
      "standard": "EIP3091"
    }
  ],
  "parent": {
    "type": "L2",
    "chain": "eip155-1"
  }
} satisfies Chain