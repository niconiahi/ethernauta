/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../shared"

export const eip155_3797 = {
  "name": "AlveyChain Mainnet",
  "shortName": "alv",
  "chain": "ALV",
  "rpc": [
    "https://elves-core1.alvey.io",
    "https://elves-core2.alvey.io",
    "https://elves-core3.alvey.io"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "AlveyCoin",
    "symbol": "ALV",
    "decimals": 18
  },
  "infoURL": "https://alveychain.com/",
  "chainId": 3797,
  "networkId": 3797,
  "explorers": [
    {
      "name": "AlveyScan",
      "url": "https://alveyscan.com",
      "standard": "EIP3091"
    }
  ]
} satisfies Chain