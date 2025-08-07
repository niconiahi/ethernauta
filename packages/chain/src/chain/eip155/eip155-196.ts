/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../shared"

export const eip155_196 = {
  "name": "X Layer Mainnet",
  "shortName": "okb",
  "chain": "X Layer",
  "icon": "xlayer",
  "rpc": [
    "https://rpc.xlayer.tech",
    "https://xlayerrpc.okx.com"
  ],
  "faucets": [],
  "features": [],
  "nativeCurrency": {
    "name": "X Layer Global Utility Token",
    "symbol": "OKB",
    "decimals": 18
  },
  "infoURL": "https://www.okx.com/xlayer",
  "chainId": 196,
  "networkId": 196,
  "explorers": [
    {
      "name": "OKLink",
      "url": "https://www.oklink.com/xlayer",
      "standard": "EIP3091"
    }
  ],
  "status": "active"
} satisfies Chain