/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../shared"

export const eip155_4088 = {
  "name": "Zeroth Mainnet",
  "shortName": "ZRH",
  "chain": "ZRH",
  "icon": "zeroth",
  "rpc": [
    "https://my.zeroth.run"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "ZRH",
    "symbol": "ZRH",
    "decimals": 18
  },
  "infoURL": "https://www.zeroth.foundation",
  "chainId": 4088,
  "networkId": 4088,
  "explorers": [
    {
      "name": "Zeroth Explorer",
      "url": "https://scan.zeroth.run",
      "standard": "EIP3091"
    }
  ]
} satisfies Chain