/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../shared"

export const eip155_7770 = {
  "name": "PandaSea Testnet",
  "shortName": "Pandasea-Testnet",
  "chain": "PandaSea Testnet",
  "rpc": [
    "https://rpc.testnet.pandasea.io"
  ],
  "faucets": [
    "https://faucet.pandasea.io"
  ],
  "nativeCurrency": {
    "name": "PandaSea Coin",
    "symbol": "PANDA",
    "decimals": 18
  },
  "infoURL": "https://test.pandaseascan.com",
  "chainId": 7770,
  "networkId": 7770,
  "explorers": [
    {
      "name": "tracehawk",
      "url": "https://test.pandaseascan.com",
      "standard": "none"
    }
  ]
} satisfies Chain