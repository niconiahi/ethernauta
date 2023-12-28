/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../../shared"

export const eip155_12 = {
  "name": "Metadium Testnet",
  "shortName": "kal",
  "chain": "META",
  "rpc": [
    "https://api.metadium.com/dev"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "Metadium Testnet Ether",
    "symbol": "KAL",
    "decimals": 18
  },
  "infoURL": "https://metadium.com",
  "chainId": 12,
  "networkId": 12,
  "slip44": 1
} satisfies Chain