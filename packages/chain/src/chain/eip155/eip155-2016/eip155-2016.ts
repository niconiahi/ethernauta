/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../../shared"

export const eip155_2016 = {
  "name": "MainnetZ Mainnet",
  "shortName": "NetZm",
  "chain": "NetZ",
  "icon": "mainnetz",
  "rpc": [
    "https://mainnet-rpc.mainnetz.io",
    "https://eu-rpc.mainnetz.io"
  ],
  "faucets": [
    "https://faucet.mainnetz.io"
  ],
  "nativeCurrency": {
    "name": "mainnetz",
    "symbol": "NetZ",
    "decimals": 18
  },
  "infoURL": "https://mainnetz.io",
  "chainId": 2016,
  "networkId": 2016,
  "explorers": [
    {
      "name": "MainnetZ",
      "url": "https://explorer.mainnetz.io",
      "standard": "EIP3091"
    }
  ]
} satisfies Chain