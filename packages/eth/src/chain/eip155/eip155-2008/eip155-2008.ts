/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../../shared"

export const eip155_2008 = {
  "name": "CloudWalk Testnet",
  "shortName": "cloudwalk_testnet",
  "chain": "CloudWalk Testnet",
  "rpc": [],
  "faucets": [],
  "nativeCurrency": {
    "name": "CloudWalk Native Token",
    "symbol": "CWN",
    "decimals": 18
  },
  "infoURL": "https://cloudwalk.io",
  "chainId": 2008,
  "networkId": 2008,
  "slip44": 1,
  "explorers": [
    {
      "name": "CloudWalk Testnet Explorer",
      "url": "https://explorer.testnet.cloudwalk.io",
      "standard": "none"
    }
  ]
} satisfies Chain