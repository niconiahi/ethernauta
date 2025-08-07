/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../shared"

export const eip155_5317 = {
  "name": "OpTrust Testnet",
  "shortName": "toptrust",
  "chain": "OpTrust",
  "icon": "optrust",
  "rpc": [
    "https://rpctest.optrust.io"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "TestBSC",
    "symbol": "tBNB",
    "decimals": 18
  },
  "infoURL": "https://optrust.io",
  "chainId": 5317,
  "networkId": 5317,
  "explorers": [
    {
      "name": "OpTrust Testnet explorer",
      "url": "https://scantest.optrust.io",
      "standard": "none"
    }
  ]
} satisfies Chain