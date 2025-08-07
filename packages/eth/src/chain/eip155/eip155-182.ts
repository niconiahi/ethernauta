/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../shared"

export const eip155_182 = {
  "name": "IOST Mainnet",
  "shortName": "iost",
  "chain": "iost",
  "icon": "bnbchain",
  "rpc": [
    "https://l2-mainnet.iost.io",
    "wss://l2-mainnet.iost.io"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "BNB Chain Native Token",
    "symbol": "BNB",
    "decimals": 18
  },
  "infoURL": "https://iost.io",
  "chainId": 182,
  "networkId": 182,
  "slip44": 714,
  "explorers": [
    {
      "name": "IOSTscan",
      "url": "https://l2-scan.iost.io",
      "standard": "EIP3091"
    }
  ],
  "parent": {
    "type": "L2",
    "chain": "eip155-56",
    "bridges": [
      {
        "url": "https://l2-bridge.iost.io"
      }
    ]
  }
} satisfies Chain