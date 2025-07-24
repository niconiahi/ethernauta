/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../../shared"

export const eip155_740 = {
  "name": "Canto Testnet",
  "shortName": "tcanto",
  "chain": "Canto Tesnet",
  "rpc": [
    "https://eth.plexnode.wtf/"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "Canto",
    "symbol": "CANTO",
    "decimals": 18
  },
  "infoURL": "https://canto.io",
  "chainId": 740,
  "networkId": 740,
  "slip44": 1,
  "explorers": [
    {
      "name": "Canto Tesnet Explorer (Neobase)",
      "url": "https://testnet-explorer.canto.neobase.one",
      "standard": "none"
    }
  ],
  "status": "deprecated"
} satisfies Chain