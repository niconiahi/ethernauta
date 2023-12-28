/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../../shared"

export const eip155_2049 = {
  "name": "Movo Smart Chain Mainnet",
  "shortName": "movo",
  "chain": "MOVO",
  "icon": "movo",
  "rpc": [
    "https://msc-rpc.movoscan.com",
    "https://msc-rpc.movochain.org",
    "https://msc-rpc.movoswap.com"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "Movo Smart Chain",
    "symbol": "MOVO",
    "decimals": 18
  },
  "infoURL": "https://movo.uk",
  "chainId": 2049,
  "networkId": 2049,
  "slip44": 2050,
  "explorers": [
    {
      "name": "movoscan",
      "url": "https://movoscan.com",
      "standard": "none"
    }
  ]
} satisfies Chain