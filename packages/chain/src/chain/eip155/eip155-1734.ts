/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../shared"

export const eip155_1734 = {
  "name": "Fuga Develop",
  "shortName": "FUGA_D",
  "chain": "Fuga",
  "rpc": [
    "https://rpc-develop.fuga.blue"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "FUGA",
    "symbol": "FUGA",
    "decimals": 18
  },
  "infoURL": "https://fuga.one",
  "chainId": 1734,
  "networkId": 1734,
  "slip44": 1,
  "explorers": [],
  "status": "incubating"
} satisfies Chain