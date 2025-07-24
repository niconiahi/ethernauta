/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../../shared"

export const eip155_1369 = {
  "name": "Zafirium Mainnet",
  "shortName": "zafic",
  "chain": "ZAFIC",
  "icon": "zafirium",
  "rpc": [
    "https://mainnet.zakumi.io"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "Zakumi Chain Native Token",
    "symbol": "ZAFIC",
    "decimals": 18
  },
  "infoURL": "https://www.zakumi.io",
  "chainId": 1369,
  "networkId": 1369,
  "explorers": [
    {
      "name": "zafirium-explorer",
      "url": "https://explorer.zakumi.io",
      "standard": "none"
    }
  ]
} satisfies Chain