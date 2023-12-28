/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../../shared"

export const eip155_167 = {
  "name": "Atoshi Testnet",
  "shortName": "atoshi",
  "chain": "ATOSHI",
  "icon": "atoshi",
  "rpc": [
    "https://node.atoshi.io/"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "ATOSHI",
    "symbol": "ATOS",
    "decimals": 18
  },
  "infoURL": "https://atoshi.org",
  "chainId": 167,
  "networkId": 167,
  "slip44": 1,
  "explorers": [
    {
      "name": "atoshiscan",
      "url": "https://scan.atoverse.info",
      "standard": "EIP3091"
    }
  ]
} satisfies Chain