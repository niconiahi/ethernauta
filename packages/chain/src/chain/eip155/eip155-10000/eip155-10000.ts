/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../../shared"

export const eip155_10000 = {
  "name": "Smart Bitcoin Cash",
  "shortName": "smartbch",
  "chain": "smartBCH",
  "rpc": [
    "https://smartbch.greyh.at",
    "https://rpc-mainnet.smartbch.org",
    "https://smartbch.fountainhead.cash/mainnet",
    "https://smartbch.devops.cash/mainnet"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "Bitcoin Cash",
    "symbol": "BCH",
    "decimals": 18
  },
  "infoURL": "https://smartbch.org/",
  "chainId": 10000,
  "networkId": 10000
} satisfies Chain