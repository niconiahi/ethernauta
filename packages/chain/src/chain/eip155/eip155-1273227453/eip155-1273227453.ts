/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../../shared"

export const eip155_1273227453 = {
  "name": "HUMAN Protocol",
  "shortName": "human-mainnet",
  "title": "HUMAN Protocol",
  "chain": "wan-red-ain",
  "rpc": [
    "https://mainnet.skalenodes.com/v1/wan-red-ain"
  ],
  "faucets": [
    "https://dashboard.humanprotocol.org/faucet"
  ],
  "nativeCurrency": {
    "name": "sFUEL",
    "symbol": "sFUEL",
    "decimals": 18
  },
  "infoURL": "https://www.humanprotocol.org",
  "chainId": 1273227453,
  "networkId": 1273227453,
  "explorers": [
    {
      "name": "Blockscout",
      "url": "https://wan-red-ain.explorer.mainnet.skalenodes.com",
      "standard": "EIP3091"
    }
  ]
} satisfies Chain