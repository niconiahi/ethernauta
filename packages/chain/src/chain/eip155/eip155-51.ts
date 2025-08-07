/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../shared"

export const eip155_51 = {
  "name": "XDC Apothem Network",
  "shortName": "txdc",
  "chain": "XDC",
  "icon": "xdc",
  "rpc": [
    "https://rpc.apothem.network",
    "https://erpc.apothem.network",
    "https://apothem.xdcrpc.com"
  ],
  "faucets": [
    "https://faucet.apothem.network",
    "https://faucet.blocksscan.io",
    "https://apothem.xdcscan.io/faucet"
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
      "url": "https://testnet.xdcscan.com",
      "standard": "EIP3091"
    },
    {
      "name": "openscan",
      "url": "https://apothem.xdcscan.io",
      "standard": "EIP3091"
    }
  ]
} satisfies Chain