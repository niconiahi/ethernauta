/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../../shared"

export const eip155_50 = {
  "name": "XDC Network",
  "shortName": "xdc",
  "chain": "XDC",
  "icon": "xdc",
  "rpc": [
    "https://erpc.xinfin.network",
    "https://rpc.xinfin.network",
    "https://rpc1.xinfin.network",
    "https://rpc-xdc.icecreamswap.com"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "XinFin",
    "symbol": "XDC",
    "decimals": 18
  },
  "infoURL": "https://xinfin.org",
  "chainId": 50,
  "networkId": 50,
  "explorers": [
    {
      "name": "xdcscan",
      "url": "https://xdcscan.io",
      "standard": "EIP3091"
    },
    {
      "name": "blocksscan",
      "url": "https://xdc.blocksscan.io",
      "standard": "EIP3091"
    }
  ]
} satisfies Chain