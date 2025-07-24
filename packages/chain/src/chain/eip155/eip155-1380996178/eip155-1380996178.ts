/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../../shared"

export const eip155_1380996178 = {
  "name": "RaptorChain",
  "shortName": "rptr",
  "chain": "RPTR",
  "icon": "raptorchain",
  "rpc": [
    "https://rpc.raptorchain.io/web3"
  ],
  "faucets": [],
  "features": [
    {
      "name": "EIP155"
    }
  ],
  "nativeCurrency": {
    "name": "Raptor",
    "symbol": "RPTR",
    "decimals": 18
  },
  "infoURL": "https://raptorchain.io",
  "chainId": 1380996178,
  "networkId": 1380996178,
  "explorers": [
    {
      "name": "RaptorChain Explorer",
      "url": "https://explorer.raptorchain.io",
      "standard": "EIP3091"
    }
  ]
} satisfies Chain