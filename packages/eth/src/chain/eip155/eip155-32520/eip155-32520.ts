/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../../shared"

export const eip155_32520 = {
  "name": "Bitgert Mainnet",
  "shortName": "Brise",
  "chain": "Brise",
  "icon": "brise",
  "rpc": [
    "https://rpc.icecreamswap.com",
    "https://mainnet-rpc.brisescan.com",
    "https://chainrpc.com",
    "https://serverrpc.com"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "Bitrise Token",
    "symbol": "Brise",
    "decimals": 18
  },
  "infoURL": "https://bitgert.com/",
  "chainId": 32520,
  "networkId": 32520,
  "explorers": [
    {
      "name": "Brise Scan",
      "url": "https://brisescan.com",
      "standard": "EIP3091"
    }
  ]
} satisfies Chain