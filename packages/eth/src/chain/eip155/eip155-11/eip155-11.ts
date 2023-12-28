/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../../shared"

export const eip155_11 = {
  "name": "Metadium Mainnet",
  "shortName": "meta",
  "chain": "META",
  "rpc": [
    "https://api.metadium.com/prod"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "Metadium Mainnet Ether",
    "symbol": "META",
    "decimals": 18
  },
  "infoURL": "https://metadium.com",
  "chainId": 11,
  "networkId": 11,
  "slip44": 916
} satisfies Chain