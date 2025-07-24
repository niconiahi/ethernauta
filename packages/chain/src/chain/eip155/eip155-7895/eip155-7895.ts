/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../../shared"

export const eip155_7895 = {
  "name": "ARDENIUM Athena",
  "shortName": "ard",
  "chain": "ATHENA",
  "icon": "ard",
  "rpc": [
    "https://rpc-athena.ardescan.com/"
  ],
  "faucets": [
    "https://faucet-athena.ardescan.com/"
  ],
  "nativeCurrency": {
    "name": "ARD",
    "symbol": "tARD",
    "decimals": 18
  },
  "infoURL": "https://ardenium.org",
  "chainId": 7895,
  "networkId": 7895,
  "explorers": [
    {
      "name": "ARDENIUM Athena Explorer",
      "url": "https://testnet.ardscan.com",
      "standard": "none"
    }
  ]
} satisfies Chain