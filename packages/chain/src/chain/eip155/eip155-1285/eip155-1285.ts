/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../../shared"

export const eip155_1285 = {
  "name": "Moonriver",
  "shortName": "mriver",
  "chain": "MOON",
  "rpc": [
    "https://rpc.api.moonriver.moonbeam.network",
    "wss://wss.api.moonriver.moonbeam.network",
    "https://moonriver.publicnode.com",
    "wss://moonriver.publicnode.com"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "Moonriver",
    "symbol": "MOVR",
    "decimals": 18
  },
  "infoURL": "https://moonbeam.network/networks/moonriver/",
  "chainId": 1285,
  "networkId": 1285,
  "explorers": [
    {
      "name": "moonscan",
      "url": "https://moonriver.moonscan.io",
      "standard": "none"
    }
  ]
} satisfies Chain