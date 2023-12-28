/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../../shared"

export const eip155_6102 = {
  "name": "Cascadia Testnet",
  "shortName": "cascadia",
  "chain": "Cascadia",
  "icon": "cascadia",
  "rpc": [
    "https://testnet.cascadia.foundation"
  ],
  "faucets": [
    "https://www.cascadia.foundation/faucet"
  ],
  "nativeCurrency": {
    "name": "CC",
    "symbol": "tCC",
    "decimals": 18
  },
  "infoURL": "https://www.cascadia.foundation",
  "chainId": 6102,
  "networkId": 6102,
  "explorers": [
    {
      "name": "Cascadia EVM Explorer",
      "url": "https://explorer.cascadia.foundation",
      "standard": "none"
    },
    {
      "name": "Cascadia Cosmos Explorer",
      "url": "https://validator.cascadia.foundation",
      "standard": "none"
    }
  ]
} satisfies Chain