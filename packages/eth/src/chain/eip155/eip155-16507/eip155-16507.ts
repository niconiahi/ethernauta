/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../../shared"

export const eip155_16507 = {
  "name": "Genesys Mainnet",
  "shortName": "Genesys",
  "chain": "Genesys",
  "icon": "genesys",
  "rpc": [
    "https://rpc.genesys.network"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "Genesys",
    "symbol": "GSYS",
    "decimals": 18
  },
  "infoURL": "https://www.genesys.network/",
  "chainId": 16507,
  "networkId": 16507,
  "explorers": [
    {
      "name": "GchainExplorer",
      "url": "https://gchainexplorer.genesys.network",
      "standard": "EIP3091"
    }
  ]
} satisfies Chain