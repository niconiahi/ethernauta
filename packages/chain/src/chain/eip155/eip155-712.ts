/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../shared"

export const eip155_712 = {
  "name": "Birdee-2",
  "shortName": "birdee-2",
  "title": "Tucana Testnet",
  "chain": "Tucana",
  "icon": "tucana",
  "rpc": [
    "https://evm-rpc.birdee-2.tucana.zone",
    "wss://evm-ws.birdee-2.tucana.zone"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "Tucana",
    "symbol": "TUC",
    "decimals": 18
  },
  "infoURL": "https://tucana.zone",
  "chainId": 712,
  "networkId": 712,
  "slip44": 1,
  "explorers": [
    {
      "name": "Birdee-2 Explorer",
      "url": "https://explorer.birdee-2.tucana.zone",
      "standard": "EIP3091"
    }
  ]
} satisfies Chain