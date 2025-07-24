/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../../shared"

export const eip155_1986 = {
  "name": "SatoshIE Testnet",
  "shortName": "satoshie_testnet",
  "chain": "TUSHY",
  "icon": "satoshie",
  "rpc": [
    "http://testnet.satosh.ie"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "Tushy Token",
    "symbol": "TUSHY",
    "decimals": 18
  },
  "infoURL": "https://satosh.ie",
  "chainId": 1986,
  "networkId": 1986,
  "slip44": 1,
  "explorers": [
    {
      "name": "testnetexplorer",
      "url": "http://explore-testnet.satosh.ie",
      "standard": "none"
    }
  ]
} satisfies Chain