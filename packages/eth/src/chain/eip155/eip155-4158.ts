/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../shared"

export const eip155_4158 = {
  "name": "CrossFi Mainnet",
  "shortName": "crossfi",
  "chain": "crossfi",
  "icon": "crossfi",
  "rpc": [
    "https://rpc.mainnet.ms/"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "CrossFi Token",
    "symbol": "XFI",
    "decimals": 18
  },
  "infoURL": "https://crossfi.org",
  "chainId": 4158,
  "networkId": 4158,
  "slip44": 1,
  "explorers": [
    {
      "name": "CrossFi Mainnet Scan",
      "url": "https://xfiscan.com",
      "standard": "none"
    }
  ]
} satisfies Chain