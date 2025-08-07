/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../shared"

export const eip155_6666665 = {
  "name": "Safe(AnWang) Mainnet",
  "shortName": "SafeMainnet",
  "chain": "Safe(AnWang)",
  "icon": "safe-anwang",
  "rpc": [
    "https://rpc.anwang.com"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "SAFE(AnWang)",
    "symbol": "SAFE",
    "decimals": 18
  },
  "infoURL": "https://www.anwang.com",
  "chainId": 6666665,
  "networkId": 6666665,
  "explorers": [
    {
      "name": "Safe(AnWang) Explorer",
      "url": "http://safe4.anwang.com",
      "standard": "EIP3091"
    }
  ]
} satisfies Chain