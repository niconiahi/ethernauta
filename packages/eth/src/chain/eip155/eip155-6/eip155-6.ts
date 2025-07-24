/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../../shared"

export const eip155_6 = {
  "name": "Kotti Testnet",
  "shortName": "kot",
  "title": "Ethereum Classic Kotti Testnet",
  "chain": "ETC",
  "icon": "ethereumclassictestnet",
  "rpc": [],
  "faucets": [],
  "nativeCurrency": {
    "name": "Kotti Ether",
    "symbol": "KOT",
    "decimals": 18
  },
  "infoURL": "https://ethereumclassic.org/development/testnets",
  "chainId": 6,
  "networkId": 6,
  "slip44": 1,
  "status": "deprecated"
} satisfies Chain