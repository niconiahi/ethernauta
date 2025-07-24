/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../../shared"

export const eip155_1287 = {
  "name": "Moonbase Alpha",
  "shortName": "mbase",
  "chain": "MOON",
  "rpc": [
    "https://rpc.api.moonbase.moonbeam.network",
    "wss://wss.api.moonbase.moonbeam.network"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "Dev",
    "symbol": "DEV",
    "decimals": 18
  },
  "infoURL": "https://docs.moonbeam.network/networks/testnet/",
  "chainId": 1287,
  "networkId": 1287,
  "slip44": 1,
  "explorers": [
    {
      "name": "moonscan",
      "url": "https://moonbase.moonscan.io",
      "standard": "none"
    }
  ]
} satisfies Chain