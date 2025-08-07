/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../shared"

export const eip155_420042 = {
  "name": "Vector Smart Chain",
  "shortName": "vsg",
  "chain": "VSC",
  "icon": "vectorsmartgas",
  "rpc": [
    "https://rpc.vscblockchain.org"
  ],
  "faucets": [],
  "features": [
    {
      "name": "EIP155"
    }
  ],
  "nativeCurrency": {
    "name": "Vector Smart Gas",
    "symbol": "VSG",
    "decimals": 18
  },
  "infoURL": "https://vsgofficial.com",
  "chainId": 420042,
  "networkId": 420042,
  "explorers": [
    {
      "name": "vscexplorer",
      "url": "https://explorer.vscblockchain.org",
      "standard": "EIP3091"
    }
  ]
} satisfies Chain