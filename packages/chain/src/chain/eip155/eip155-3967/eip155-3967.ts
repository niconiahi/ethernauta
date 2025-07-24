/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../../shared"

export const eip155_3967 = {
  "name": "DYNO Testnet",
  "shortName": "tdyno",
  "chain": "DYNO",
  "rpc": [
    "https://tapi.dynoprotocol.com"
  ],
  "faucets": [
    "https://faucet.dynoscan.io"
  ],
  "nativeCurrency": {
    "name": "DYNO Token",
    "symbol": "tDYNO",
    "decimals": 18
  },
  "infoURL": "https://dynoprotocol.com",
  "chainId": 3967,
  "networkId": 3967,
  "slip44": 1,
  "explorers": [
    {
      "name": "DYNO Explorer",
      "url": "https://testnet.dynoscan.io",
      "standard": "EIP3091"
    }
  ]
} satisfies Chain