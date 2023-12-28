/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../../shared"

export const eip155_588 = {
  "name": "Metis Stardust Testnet",
  "shortName": "metis-stardust",
  "chain": "ETH",
  "rpc": [
    "https://stardust.metis.io/?owner=588"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "tMetis",
    "symbol": "METIS",
    "decimals": 18
  },
  "infoURL": "https://www.metis.io",
  "chainId": 588,
  "networkId": 588,
  "slip44": 1,
  "explorers": [
    {
      "name": "blockscout",
      "url": "https://stardust-explorer.metis.io",
      "standard": "EIP3091"
    }
  ],
  "parent": {
    "type": "L2",
    "chain": "eip155-4",
    "bridges": [
      {
        "url": "https://bridge.metis.io"
      }
    ]
  },
  "status": "deprecated"
} satisfies Chain