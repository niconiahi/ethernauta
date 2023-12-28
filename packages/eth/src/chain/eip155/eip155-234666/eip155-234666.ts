/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../../shared"

export const eip155_234666 = {
  "name": "Haymo Testnet",
  "shortName": "hym",
  "chain": "tHYM",
  "rpc": [
    "https://testnet1.haymo.network"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "HAYMO",
    "symbol": "HYM",
    "decimals": 18
  },
  "infoURL": "https://haymoswap.web.app/",
  "chainId": 234666,
  "networkId": 234666,
  "slip44": 1
} satisfies Chain