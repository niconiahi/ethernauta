/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../../shared"

export const eip155_10946 = {
  "name": "Quadrans Blockchain",
  "shortName": "quadrans",
  "chain": "QDC",
  "icon": "quadrans",
  "rpc": [
    "https://rpc.quadrans.io",
    "https://rpcna.quadrans.io",
    "https://rpceu.quadrans.io"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "Quadrans Coin",
    "symbol": "QDC",
    "decimals": 18
  },
  "infoURL": "https://quadrans.io",
  "chainId": 10946,
  "networkId": 10946,
  "explorers": [
    {
      "name": "explorer",
      "url": "https://explorer.quadrans.io",
      "standard": "EIP3091"
    }
  ]
} satisfies Chain