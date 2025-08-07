/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../shared"

export const eip155_1336 = {
  "name": "Kii Testnet Oro",
  "shortName": "kiioro",
  "chain": "KII",
  "icon": "kii",
  "rpc": [
    "https://json-rpc.uno.sentry.testnet.v3.kiivalidator.com"
  ],
  "faucets": [
    "https://explorer.kiichain.io/testnet/faucet"
  ],
  "features": [],
  "nativeCurrency": {
    "name": "Kii",
    "symbol": "KII",
    "decimals": 18
  },
  "infoURL": "https://kiichain.io",
  "chainId": 1336,
  "networkId": 1336,
  "explorers": [
    {
      "name": "KiiExplorer",
      "url": "https://explorer.kiichain.io/testnet",
      "standard": "none"
    }
  ]
} satisfies Chain