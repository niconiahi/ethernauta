/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../shared"

export const eip155_1234567 = {
  "name": "Sharecle Mainnet",
  "shortName": "shr",
  "chain": "SHARECLE",
  "icon": "sharecle",
  "rpc": [
    "https://mainnet.sharecle.com"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "SHARECLE COIN",
    "symbol": "SHR",
    "decimals": 18
  },
  "infoURL": "https://sharecle.com/",
  "chainId": 1234567,
  "networkId": 1234567,
  "slip44": 1,
  "explorers": [
    {
      "name": "Etherscan",
      "url": "https://etherscan.io",
      "standard": "none"
    }
  ]
} satisfies Chain