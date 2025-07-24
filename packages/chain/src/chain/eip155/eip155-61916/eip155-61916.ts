/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../../shared"

export const eip155_61916 = {
  "name": "DoKEN Super Chain Mainnet",
  "shortName": "DoKEN",
  "chain": "DoKEN Super Chain",
  "icon": "doken",
  "rpc": [
    "https://sgrpc.doken.dev",
    "https://nyrpc.doken.dev",
    "https://ukrpc.doken.dev"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "DoKEN",
    "symbol": "DKN",
    "decimals": 18
  },
  "infoURL": "https://doken.dev/",
  "chainId": 61916,
  "networkId": 61916,
  "explorers": [
    {
      "name": "DSC Scan",
      "url": "https://explore.doken.dev",
      "standard": "EIP3091"
    }
  ]
} satisfies Chain