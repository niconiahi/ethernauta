/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../../shared"

export const eip155_4242 = {
  "name": "Nexi Mainnet",
  "shortName": "nexi",
  "chain": "Nexi",
  "icon": "nexi",
  "rpc": [
    "https://rpc.chain.nexi.technology/",
    "https://chain.nexilix.com",
    "https://chain.nexi.evmnode.online"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "Nexi",
    "symbol": "NEXI",
    "decimals": 18
  },
  "infoURL": "https://www.nexi.technology/",
  "chainId": 4242,
  "networkId": 4242,
  "slip44": 2500,
  "explorers": [
    {
      "name": "nexiscan",
      "url": "https://www.nexiscan.com",
      "standard": "EIP3091"
    }
  ]
} satisfies Chain