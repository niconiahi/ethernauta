/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../shared"

export const eip155_6666689 = {
  "name": "The Ting Blockchain Testnet Explorer",
  "shortName": "ting-testnet",
  "chain": "Ting",
  "rpc": [
    "https://testnet.tingchain.org",
    "https://public.0xrpc.com/6666689"
  ],
  "faucets": [],
  "features": [
    {
      "name": "EIP155"
    },
    {
      "name": "EIP1559"
    }
  ],
  "nativeCurrency": {
    "name": "Ton",
    "symbol": "Ton",
    "decimals": 18
  },
  "infoURL": "https://tingscan.com",
  "chainId": 6666689,
  "networkId": 6666689,
  "explorers": [
    {
      "name": "TingScan",
      "url": "https://tingscan.com",
      "standard": "EIP3091"
    }
  ]
} satisfies Chain