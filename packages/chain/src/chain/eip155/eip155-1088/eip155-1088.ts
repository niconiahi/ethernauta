/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../../shared"

export const eip155_1088 = {
  "name": "Metis Andromeda Mainnet",
  "shortName": "metis-andromeda",
  "chain": "ETH",
  "rpc": [
    "https://andromeda.metis.io/?owner=1088"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "Metis",
    "symbol": "METIS",
    "decimals": 18
  },
  "infoURL": "https://www.metis.io",
  "chainId": 1088,
  "networkId": 1088,
  "explorers": [
    {
      "name": "blockscout",
      "url": "https://andromeda-explorer.metis.io",
      "standard": "EIP3091"
    }
  ],
  "parent": {
    "type": "L2",
    "chain": "eip155-1",
    "bridges": [
      {
        "url": "https://bridge.metis.io"
      }
    ]
  }
} satisfies Chain