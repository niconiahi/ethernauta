/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../shared"

export const eip155_1444673419 = {
  "name": "SKALE Europa Hub Testnet",
  "shortName": "europa-testnet",
  "title": "SKALE Europa Hub Testnet",
  "chain": "juicy-low-small-testnet",
  "icon": "europa",
  "rpc": [
    "https://testnet.skalenodes.com/v1/juicy-low-small-testnet"
  ],
  "faucets": [
    "https://www.sfuelstation.com/"
  ],
  "nativeCurrency": {
    "name": "sFUEL",
    "symbol": "sFUEL",
    "decimals": 18
  },
  "infoURL": "https://europahub.network/",
  "chainId": 1444673419,
  "networkId": 1444673419,
  "slip44": 1,
  "explorers": [
    {
      "name": "Blockscout",
      "url": "https://juicy-low-small-testnet.explorer.testnet.skalenodes.com",
      "standard": "EIP3091"
    }
  ]
} satisfies Chain