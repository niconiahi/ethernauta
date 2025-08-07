/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../shared"

export const eip155_176 = {
  "name": "DC Mainnet",
  "shortName": "dcchain",
  "chain": "dcchain",
  "icon": "dcchain",
  "rpc": [
    "https://rpc.dcnetio.cloud",
    "wss://ws.dcnetio.cloud"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "DC Native Token",
    "symbol": "DCT",
    "decimals": 18
  },
  "infoURL": "https://www.dcnetio.cloud",
  "chainId": 176,
  "networkId": 176,
  "explorers": [
    {
      "name": "dcscan",
      "url": "https://exp.dcnetio.cloud",
      "standard": "none"
    }
  ]
} satisfies Chain