/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../shared"

export const eip155_711 = {
  "name": "Tucana",
  "shortName": "tuc",
  "title": "Tucana Testnet",
  "chain": "Tucana",
  "icon": "tucana",
  "rpc": [
    "https://evm-rpc.tucana.zone",
    "wss://evm-ws.tucana.zone"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "Tucana",
    "symbol": "TUC",
    "decimals": 18
  },
  "infoURL": "https://tucana.zone",
  "chainId": 711,
  "networkId": 711,
  "slip44": 1,
  "explorers": [
    {
      "name": "Tucana Explorer",
      "url": "https://explorer.tucana.zone",
      "standard": "EIP3091"
    }
  ]
} satisfies Chain