/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../../shared"

export const eip155_49797 = {
  "name": "Energi Testnet",
  "shortName": "tnrg",
  "chain": "NRG",
  "rpc": [
    "https://nodeapi.test.energi.network"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "Energi",
    "symbol": "NRG",
    "decimals": 18
  },
  "infoURL": "https://www.energi.world/",
  "chainId": 49797,
  "networkId": 49797,
  "slip44": 1
} satisfies Chain