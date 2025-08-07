/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../shared"

export const eip155_1992 = {
  "name": "Hubble Exchange",
  "shortName": "hubblenet",
  "chain": "Hubblenet",
  "icon": "hubblenet",
  "rpc": [
    "https://rpc.hubble.exchange",
    "wss://ws-rpc.hubble.exchange"
  ],
  "faucets": [],
  "features": [
    {
      "name": "EIP155"
    },
    {
      "name": "EIP1559"
    }
  ],
  "nativeCurrency": {
    "name": "USD Coin",
    "symbol": "USDC",
    "decimals": 18
  },
  "infoURL": "https://www.hubble.exchange",
  "chainId": 1992,
  "networkId": 1992,
  "slip44": 60,
  "explorers": []
} satisfies Chain