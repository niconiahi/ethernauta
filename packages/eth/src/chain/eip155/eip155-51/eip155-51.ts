/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../../shared"

export const eip155_51 = {
  "name": "XDC Apothem Network",
  "shortName": "txdc",
  "chain": "XDC",
  "icon": "xdc",
  "rpc": [
    "https://rpc.apothem.network",
    "https://erpc.apothem.network"
  ],
  "faucets": [
    "https://faucet.apothem.network"
  ],
  "nativeCurrency": {
    "name": "XinFin",
    "symbol": "TXDC",
    "decimals": 18
  },
  "infoURL": "https://xinfin.org",
  "chainId": 51,
  "networkId": 51,
  "explorers": [
    {
      "name": "xdcscan",
      "url": "https://apothem.xinfinscan.com",
      "standard": "EIP3091"
    },
    {
      "name": "blocksscan",
      "url": "https://apothem.blocksscan.io",
      "standard": "EIP3091"
    }
  ]
} satisfies Chain