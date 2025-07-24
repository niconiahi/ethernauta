/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../../shared"

export const eip155_115 = {
  "name": "DeBank Testnet(Deprecated)",
  "shortName": "debank-testnet",
  "chain": "DeBank",
  "icon": "debank",
  "rpc": [],
  "faucets": [],
  "nativeCurrency": {
    "name": "Ether",
    "symbol": "ETH",
    "decimals": 18
  },
  "infoURL": "https://debank.com",
  "chainId": 115,
  "networkId": 115,
  "slip44": 1,
  "explorers": [],
  "status": "deprecated"
} satisfies Chain