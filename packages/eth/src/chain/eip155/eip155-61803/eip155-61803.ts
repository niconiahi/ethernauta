/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../../shared"

export const eip155_61803 = {
  "name": "Etica Mainnet",
  "shortName": "Etica",
  "chain": "Etica Protocol (ETI/EGAZ)",
  "icon": "etica",
  "rpc": [
    "https://eticamainnet.eticascan.org",
    "https://eticamainnet.eticaprotocol.org"
  ],
  "faucets": [
    "http://faucet.etica-stats.org/"
  ],
  "nativeCurrency": {
    "name": "EGAZ",
    "symbol": "EGAZ",
    "decimals": 18
  },
  "infoURL": "https://eticaprotocol.org",
  "chainId": 61803,
  "networkId": 61803,
  "explorers": [
    {
      "name": "eticascan",
      "url": "https://eticascan.org",
      "standard": "EIP3091"
    },
    {
      "name": "eticastats",
      "url": "http://explorer.etica-stats.org",
      "standard": "EIP3091"
    }
  ]
} satisfies Chain