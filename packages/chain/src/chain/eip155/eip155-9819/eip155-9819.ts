/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../../shared"

export const eip155_9819 = {
  "name": "IMPERIUM MAINNET",
  "shortName": "IMP",
  "chain": "IMP",
  "icon": "imp",
  "rpc": [
    "https://data-aws-mainnet.imperiumchain.com",
    "https://data-aws2-mainnet.imperiumchain.com"
  ],
  "faucets": [
    "https://faucet.imperiumchain.com/"
  ],
  "nativeCurrency": {
    "name": "IMP",
    "symbol": "IMP",
    "decimals": 18
  },
  "infoURL": "https://imperiumchain.com",
  "chainId": 9819,
  "networkId": 9819,
  "explorers": [
    {
      "name": "IMPERIUM Explorer",
      "url": "https://impscan.com",
      "standard": "none"
    }
  ]
} satisfies Chain