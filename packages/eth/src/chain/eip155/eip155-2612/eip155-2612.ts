/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../../shared"

export const eip155_2612 = {
  "name": "EZChain C-Chain Mainnet",
  "shortName": "EZChain",
  "chain": "EZC",
  "icon": "ezchain",
  "rpc": [
    "https://api.ezchain.com/ext/bc/C/rpc"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "EZChain",
    "symbol": "EZC",
    "decimals": 18
  },
  "infoURL": "https://ezchain.com",
  "chainId": 2612,
  "networkId": 2612,
  "explorers": [
    {
      "name": "ezchain",
      "url": "https://cchain-explorer.ezchain.com",
      "standard": "EIP3091"
    }
  ]
} satisfies Chain