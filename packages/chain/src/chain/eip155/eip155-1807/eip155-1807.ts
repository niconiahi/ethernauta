/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../../shared"

export const eip155_1807 = {
  "name": "Rabbit Analog Testnet Chain",
  "shortName": "rAna",
  "chain": "rAna",
  "icon": "rabbit",
  "rpc": [
    "https://rabbit.analog-rpc.com"
  ],
  "faucets": [
    "https://analogfaucet.com"
  ],
  "nativeCurrency": {
    "name": "Rabbit Analog Test Chain Native Token ",
    "symbol": "rAna",
    "decimals": 18
  },
  "infoURL": "https://rabbit.analogscan.com",
  "chainId": 1807,
  "networkId": 1807,
  "slip44": 1,
  "explorers": [
    {
      "name": "blockscout",
      "url": "https://rabbit.analogscan.com",
      "standard": "none"
    }
  ]
} satisfies Chain