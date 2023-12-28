/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../../shared"

export const eip155_1311 = {
  "name": "Dos Fuji Subnet",
  "shortName": "TDOS",
  "chain": "DOS",
  "rpc": [
    "https://test.doschain.com/jsonrpc"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "Dos Native Token",
    "symbol": "DOS",
    "decimals": 18
  },
  "infoURL": "http://doschain.io/",
  "chainId": 1311,
  "networkId": 1311,
  "explorers": [
    {
      "name": "dos-testnet",
      "url": "https://test.doscan.io",
      "standard": "EIP3091"
    }
  ]
} satisfies Chain