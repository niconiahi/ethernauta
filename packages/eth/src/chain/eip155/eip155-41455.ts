/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../shared"

export const eip155_41455 = {
  "name": "Aleph Zero EVM",
  "shortName": "aleph-zero",
  "chain": "Aleph Zero EVM",
  "icon": "aleph-zero",
  "rpc": [
    "https://rpc.alephzero.raas.gelato.cloud",
    "wss://ws.alephzero.raas.gelato.cloud"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "Aleph Zero",
    "symbol": "AZERO",
    "decimals": 18
  },
  "infoURL": "https://alephzero.org/",
  "chainId": 41455,
  "networkId": 41455,
  "explorers": [
    {
      "name": "Aleph Zero EVM Mainnet Explorer",
      "url": "https://evm-explorer.alephzero.org",
      "standard": "none"
    }
  ]
} satisfies Chain